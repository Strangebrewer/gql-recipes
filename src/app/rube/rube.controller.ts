import { Controller, Inject, Post, Req, Request } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { RubeConfig } from 'src/config/rube';
import { TracerConfig } from 'src/config/tracer';
import { TRACER_CLIENT, TracerClient } from 'src/shared/tracer/tracer.module';

async function indicatorsSearch(word: string): Promise<{ title: string; link: string } | null> {
  const resp = await axios.get(`https://search.owid.io/indicators?query=${word}`);
  const indicators: { title: string }[] = resp.data?.results ?? [];
  if (!indicators.length) return null;

  for (const indicator of indicators) {
    const searchResp = await axios.get(
      `https://ourworldindata.org/api/search?q=${encodeURIComponent(indicator.title)}`,
    );
    const hits: { title: string; url: string }[] = searchResp.data?.results ?? [];
    if (hits.length) {
      const hit = hits[Math.floor(Math.random() * hits.length)];
      return { title: hit.title, link: hit.url };
    }
  }
  return null;
}

async function directSearch(word: string): Promise<{ title: string; link: string } | null> {
  const resp = await axios.get(
    `https://ourworldindata.org/api/search?q=${encodeURIComponent(word)}`,
  );
  const hits: { title: string; url: string }[] = resp.data?.results ?? [];
  if (!hits.length) return null;
  const hit = hits[Math.floor(Math.random() * hits.length)];
  return { title: hit.title, link: hit.url };
}

@Controller('rube')
export class RubeController {
  constructor(
    @Inject(TRACER_CLIENT) private readonly tracer: TracerClient,
    private readonly configSvc: ConfigService,
  ) {}

  @Post()
  async rubeHandler(@Req() req: Request) {
    const start = new Date();
    const traceId = req.headers['x-trace-id'] as string;
    const { service } = this.configSvc.get<TracerConfig>('tracer');
    const { nextUrl } = this.configSvc.get<RubeConfig>('rube');

    const words = req.body['words'] as string[];
    const word = words[Math.floor(Math.random() * words.length)];

    const headers = { 'X-Trace-ID': traceId };

    const useIndicatorsFirst = Math.random() < 0.5;
    const strategies = useIndicatorsFirst
      ? [() => indicatorsSearch(word), () => directSearch(word)]
      : [() => directSearch(word), () => indicatorsSearch(word)];

    let owid = await strategies[0]();
    if (!owid) owid = await strategies[1]();

    if (!owid) {
      try {
        this.tracer.send({
          traceId,
          spanId: crypto.randomUUID(),
          service,
          operation: 'rubeHandler',
          status: 'error',
          error: 'no results from OWID',
          startTime: start,
          endTime: new Date(),
        });
      } catch (error) {
        console.log('error in tracer send:::', error['message']);
      }
      throw new Error('no results from OWID');
    }

    let downstream;
    try {
      downstream = await axios.post(
        nextUrl,
        {
          link: owid.link,
          title: owid.title,
          userId: req.body['userId'],
          expiresAt: req.body['expiresAt'],
        },
        { headers },
      );
    } catch (error) {
      console.log(`error in downstream fetch from ${nextUrl}:::`, error);
    }

    if (traceId) {
      try {
        this.tracer.send({
          traceId,
          spanId: crypto.randomUUID(),
          service,
          operation: 'rubeHandler',
          status: 'ok',
          startTime: start,
          endTime: new Date(),
          metaData: { word, title: owid.title, link: owid.link },
        });
      } catch (error) {
        console.log('error in tracer send:::', error['message']);
      }
    }

    return downstream.data;
  }
}

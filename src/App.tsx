import { css } from "twin.macro";
import { ResponsiveLine } from "@nivo/line";
import useSWR from "swr";
import { PuffLoader } from "react-spinners";
import StatCard from "./components/StatCard";
import Card from "./components/Card";
import Page from "./components/Page";
import fetcher from "./utils/fetcher";
import calculateRoundedPrice from "./utils/calculateRoundedPrice";

type MetricData = {
  name?: string;
  symbol?: string;
  market_data?: {
    price_usd?: number;
  };
  marketcap?: {
    current_marketcap_usd?: number;
  };
  all_time_high?: {
    price?: number;
  };
};

type ChartData = {
  values: Array<[number, number, number, number, number, number]>;
};

function App(): JSX.Element {
  const { data, error } = useSWR<MetricData | null>(
    "https://data.messari.io/api/v1/assets/btc/metrics",
    fetcher,
    { refreshInterval: 10000 }
  );

  const { data: chartData, error: chartError } = useSWR<ChartData | null>(
    "https://data.messari.io/api/v1/assets/btc/metrics/price/time-series?start=2021-01-01&end=2021-02-01&interval=1d",
    fetcher
  );

  const graphData = (chartData?.values ?? []).map((value) => {
    const timestamp = value[0];
    const closePriceUSD = value[4];
    return {
      x: new Date(timestamp),
      y: closePriceUSD,
    };
  });

  if (error != null || chartError != null) {
    return (
      <Page tw="min-h-screen justify-center text-center">
        <h1 tw="text-2xl font-semibold text-red-600">
          There was an error in loading the asset. Please try again later.
        </h1>
      </Page>
    );
  }

  if (data == null || chartData == null) {
    return (
      <Page tw="min-h-screen justify-center items-center">
        <PuffLoader />
      </Page>
    );
  }

  return (
    <Page tw="space-y-4">
      <div tw="flex items-center space-x-2">
        <h1 tw="text-4xl font-bold">{data?.name ?? ""}</h1>
        <span tw="text-2xl font-light">({data?.symbol ?? ""})</span>
      </div>
      <Card tw="flex flex-col">
        <h3 tw="text-lg font-bold">Price over time</h3>
        <div
          css={css`
            height: 400px;
            min-width: 0;
          `}
          tw="mt-8 hidden md:block"
        >
          {graphData.length !== 0 && (
            <ResponsiveLine
              margin={{ top: 20, right: 30, bottom: 40, left: 40 }}
              enableSlices="x"
              enableGridY={false}
              curve="linear"
              data={[
                {
                  id: "Close Price",
                  data: graphData,
                },
              ]}
              yFormat={(value) => {
                return calculateRoundedPrice(Number(value));
              }}
              axisLeft={{
                format: (value) => {
                  return calculateRoundedPrice(value, true, false);
                },
              }}
              xScale={{
                type: "time",
                useUTC: false,
                precision: "day",
              }}
              axisBottom={{
                format: "%b %d",
                tickValues: "every day",
                tickRotation: 50,
              }}
            />
          )}
        </div>
        <div
          css={css`
            height: 400px;
            min-width: 0;
          `}
          tw="mt-8 md:hidden"
        >
          {graphData.length !== 0 && (
            <ResponsiveLine
              margin={{ top: 20, right: 10, bottom: 30, left: 40 }}
              enableSlices="x"
              sliceTooltip={(props) => {
                const {
                  slice: {
                    points: [point],
                  },
                } = props;

                return (
                  <Card tw="flex flex-col px-4 py-2 ">
                    <span> {point.data.xFormatted}</span>
                    <span>{point.data.yFormatted}</span>
                  </Card>
                );
              }}
              curve="linear"
              data={[
                {
                  id: "Close Price",
                  data: graphData,
                },
              ]}
              xFormat="time:%b %d"
              yFormat={(value) => {
                return calculateRoundedPrice(Number(value));
              }}
              axisLeft={{
                format: (value) => {
                  return calculateRoundedPrice(value, true, false);
                },
              }}
              xScale={{
                type: "time",
                useUTC: false,
                precision: "day",
              }}
              axisBottom={null}
            />
          )}
        </div>
      </Card>
      <h2 tw="text-2xl font-medium">Stats</h2>
      <StatCard
        title="Current Price"
        value={
          data?.market_data?.price_usd != null &&
          Number.isFinite(data.market_data.price_usd)
            ? calculateRoundedPrice(data.market_data.price_usd, false)
            : "N/A"
        }
      />
      <StatCard
        title="Market cap"
        value={
          data?.marketcap?.current_marketcap_usd != null &&
          Number.isFinite(data.marketcap.current_marketcap_usd)
            ? calculateRoundedPrice(
                data?.marketcap?.current_marketcap_usd,
                true
              )
            : "N/A"
        }
      />
      <StatCard
        title="All time high"
        value={
          data?.all_time_high?.price != null &&
          Number.isFinite(data.all_time_high.price)
            ? calculateRoundedPrice(data.all_time_high.price, false)
            : "N/A"
        }
      />
    </Page>
  );
}

export default App;

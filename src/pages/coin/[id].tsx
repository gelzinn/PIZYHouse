/* eslint-disable @next/next/no-img-element */
import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Image from "next/image";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { Chart } from "react-google-charts";

// import Header from "../components/Header";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { CryptoInfos } from "../../styles/pages/coin";
import { BGContent } from "~/components/BGContent/styles";

function abbreviate(num: any) {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
  var item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });
  return item
    ? (num / item.value).toFixed(1).replace(rx, "$1") + item.symbol
    : "0";
}

const formatterToMoney = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});

interface CoinPageProps {
  coindata: {
    image: { large: string };
    name: string;
    symbol: string;
    market_cap_rank: number;
    market_data: {
      market_cap_change_percentage_24h: number;
      high_24h: {
        brl: number;
      };
      low_24h: {
        brl: number;
      };
      total_supply: number;
    };
  };
  handleLoggedChange: () => void;
}

interface ChartProps {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

export default function Coin({ coindata, handleLoggedChange }: CoinPageProps) {
  const [chartInfo, setChartInfo] = useState([]);

  useEffect(() => {
    const coinNameToFetch = coindata.name.toLowerCase();

    fetch(
      `https://api.coingecko.com/api/v3/coins/${coinNameToFetch}/ohlc?vs_currency=brl&days=7`
    )
      .then((res) => res.json())
      .then((data) => {
        const cdata = data.map((d: any) => {
          return {
            time: d[0],
            open: parseFloat(d[1]),
            high: parseFloat(d[2]),
            low: parseFloat(d[3]),
            close: parseFloat(d[4]),
          };
        });
        setChartInfo(cdata);
      })
      .catch((err) => console.log(err));
  }, [coindata.name]);

  // const data = () => {
  //   chartInfo.map(({ time, open, high, low, close }: ChartProps) => {
  //     return [
  //       ["Time", "a", "b", "c", "d"],
  //       [{ time }, { open }, { high }, { low }, { close }],
  //     ];
  //   });
  // };

  const data = [
    ["Time", "a", "b", "c", "d"],
    ["Mon", 20, 28, 38, 45],
    ["Tue", 31, 38, 55, 66],
    ["Wed", 50, 55, 77, 80],
    ["Thu", 50, 77, 66, 77],
    ["Fri", 15, 66, 22, 68],
  ];

  const options = {
    legend: "none",
    bar: { groupWidth: "100%" },
    backgroundColor: "transparent",
    candlestick: {
      fallingColor: { strokeWidth: 0, fill: "#a52714" },
      risingColor: { strokeWidth: 0, fill: "#0f9d58" },
    },
  };

  return (
    <>
      <Head>
        <title>PIZY House · Informações sobre {coindata.name}</title>
        <meta
          name="description"
          content="A empresa tem como foco a criação de novos investidores que no futuro podem influenciar no mercado de ações com a utilização de moedas criptografadas e tudo sobre esse novo mundo tecnológico."
        />
        <link rel="icon" href="/favicon.png" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </Head>

      <Navbar handleLoggedChange={handleLoggedChange} />
      <main>
        <h1>Informações sobre {coindata.name}</h1>
        <CryptoInfos>
          <div className="info-coin">
            <div className="coin">
              <img src={coindata.image.large} alt={coindata.name} />
              <span>{coindata.name}</span>
              <p>{coindata.symbol}</p>
            </div>
            <div className="stats">
              <dt>Geral</dt>
              <li>
                <span>Market cap rank</span>
                <p className="market_cap_rank">{coindata.market_cap_rank}</p>
              </li>
              <li>
                <span>Market cap change</span>
                <p className="market_cap_change">
                  {coindata.market_data.market_cap_change_percentage_24h.toFixed(
                    2
                  )}
                </p>
              </li>
              <dt>Nas últimas 24 horas</dt>
              <li>
                <span>Valor mais alto</span>
                <p>
                  {formatterToMoney.format(coindata.market_data.high_24h.brl)}
                </p>
              </li>
              <li>
                <span>Valor mais baixo</span>
                <p>
                  {formatterToMoney.format(coindata.market_data.low_24h.brl)}
                </p>
              </li>
              <dt>Outras informações</dt>
              <li>
                <span>Volume total</span>
                <p>{abbreviate(coindata.market_data.total_supply)}</p>
              </li>
            </div>
          </div>
          <div className="graph">
            <Chart
              chartType="CandlestickChart"
              width="100%"
              height="500px"
              data={data}
              options={options}
            />
          </div>
        </CryptoInfos>
      </main>
      <Footer />
      <BGContent />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  const response = await fetch(`https://api.coingecko.com/api/v3/coins/`);
  const data = await response.json();

  const paths = data.map((coin: any) => {
    return { params: { id: coin.id } };
  });

  return {
    paths,
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  const { id }: any = context.params;

  const response = await fetch(
    `https://api.coingecko.com/api/v3/coins/${id}?sparkline=true`
  );
  const data = await response.json();

  return {
    props: {
      coindata: data,
    },
    revalidate: 5,
  };
};
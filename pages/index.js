import Head from "next/head";
import { useEffect, useState } from "react";
import styles from "../styles/Home.module.css";
import fetchData from "./api/times";

const minute = 1000 * 60;
const hour = 60 * minute;
const day = 24 * hour;

export default function Home(props) {
  const { articles } = props;

  const suezTime = new Date("2021-03-23T09:40:00.000Z");
  const now = new Date();
  const diff = now - suezTime;

  console.log({ diff });

  const days = Math.floor(diff / day);
  const hours = Math.floor((diff - days * day) / hour);
  const minutes = Math.floor((diff - days * day - hours * hour) / minute);
  const durationText = `It's been like this for ${days} days, ${hours} hours and ${minutes} minutes.`;

  return (
    <div className={styles.container}>
      <Head>
        <title>Is the ship still stuck?</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@tomjneill" />
        <meta name="twitter:creator" content="@tomjneill" />
        <meta name="twitter:title" content="Is this ship still stuck?" />
        <meta
          name="twitter:description"
          content="You know that ship, the one possibly still stuck in the canal. Is it still there? Find out that, and really only that, at this website."
        />
        <meta
          name="twitter:image"
          content="https://istheshipstillstuck.com/ever-given.jpg"
        />
        <meta
          property="og:image"
          content="https://istheshipstillstuck.com/ever-given.jpg"
        />
        <meta name="twitter:image:alt" content="That ship" />
        <meta
          property="og:description"
          content="You know that ship, the one possibly still stuck in the canal. Is it still there? Find out that, and really only that, at this website."
        />
        <meta property="og:title" content="Is this ship still stuck?" />
        <meta property="og:url" content={"https://istheshipstillstuck.com"} />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Is that ship still stuck?</h1>

        <p className={styles.description}>
          <a
            href="https://www.tiktok.com/@jonnystewartbass/video/6913909783548431618"
            target="_blank"
            rel="noopener norferrer"
          >
            Yes.
          </a>
        </p>
        <p>{durationText}</p>

        <div style={{ width: "100%", maxWidth: 600 }}>
          <div
            dangerouslySetInnerHTML={{
              __html: `<script type="text/javascript">
  var width="100%";var height="400";var zoom="14"; 
  var mmsi=353136000;
</script><script type="text/javascript" src="https://www.vesselfinder.com/aismap.js"></script>`,
            }}
          />
        </div>

        <h3
          style={{
            textAlign: "left",
            width: "100%",
            maxWidth: 500,
            margin: "auto",
            marginBottom: 16,
            marginTop: 48,
            alignItems: "center",
            fontSize: "24px",
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          Latest headlines
          <img src="https://developer.nytimes.com/files/poweredby_nytimes_200c.png" />
        </h3>
        <div className={styles.grid}>
          {articles?.map((article) => (
            <a href={article.web_url} key={article._id}>
              <section
                style={{
                  maxWidth: 500,
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 32,
                  border: "1px solid #DBDBDB",
                }}
              >
                {article.multimedia[0]?.url ? (
                  <img
                    src={`https://nytimes.com/${article.multimedia[0]?.url}`}
                    style={{
                      width: "100%",
                      height: 250,
                      objectFit: "cover",
                    }}
                  />
                ) : (
                  <div
                    style={{
                      display: "flex",
                      width: "100%",
                      justifyContent: "center",
                    }}
                  >
                    <img
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/New_York_Times_logo_variation.jpg/960px-New_York_Times_logo_variation.jpg"
                      alt="NYT Logo"
                      style={{
                        width: 200,
                        marginX: "auto",
                      }}
                    />
                  </div>
                )}

                <div style={{ padding: 12 }}>
                  <h2 style={{ marginTop: 0 }}>{article.headline.main}</h2>
                  <span style={{ opacity: "60%" }}>
                    Published: {new Date(article.pub_date).toLocaleString()}
                  </span>
                  <p>{article.snippet}</p>
                </div>
              </section>
            </a>
          ))}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://twitter.com/TomJNeill"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p style={{ marginBottom: 0 }}>
            Made by <span style={{ color: "blue" }}>Tom Neill</span> as a bit of
            fun.
          </p>
        </a>{" "}
        <a
          href="https://xkcd.com/937/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <p>
            <span style={{ color: "blue" }}>Tornado Guard</span> warnings apply.
          </p>
        </a>
      </footer>
    </div>
  );
}

export async function getStaticProps() {
  const articles = await fetchData()
    .then((response) => response.json())
    .then((data) => {
      if (data?.response?.docs) {
        return data?.response?.docs;
      } else {
        console.log({ data });
        return [];
      }
    });

  return {
    props: { articles },
    // we will attempt to re-generate the page:
    // - when a request comes in
    // - at most once every second
    revalidate: 150,
  };
}

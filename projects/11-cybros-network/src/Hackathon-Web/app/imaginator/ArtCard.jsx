import React, { useEffect, useMemo, useState } from "react";
import { API_URL, dm_mono_font, ON_POLKADOT_QUERY_URL } from "@/constants";
import Link from "next/link";
import axios from "axios";
import { useAtomValue } from "jotai";
import { currentCybrosAddress } from "@/utils/atoms";

const BG_COLOR_MAP = {
  Pending: "#FF6F2D0F",
  Processing: "#FB2DFF0F",
  Discarded: "#0000000F",

  Success: "#0083FD0F",
  Fail: "#0000000F",
  Error: "#0000000F",
  Panic: "#0000000F",

  Minted: "#00983D0F",
};

const InfoLine = ({ title, info }) => {
  return (
    <div className="flex flex-col justify-start gap-[3px]">
      <p className="font-medium text-[16px] leading-21 text-cb-normal">
        {title}
      </p>
      <div className={dm_mono_font.className}>
        <p className="text-[13px] text-cb-value line-clamp-2 h-[34px] leading-[17px] break-all">
          {info}
        </p>
      </div>
    </div>
  );
};

const ActionArea = ({ job, minted, setMinted, status, url }) => {
  const currCybrosAcc = useAtomValue(currentCybrosAddress);
  const beneficiary = job.beneficiary;
  const canMint =
    status === "Success" && currCybrosAcc === beneficiary && !minted;
  return (
    <div className="flex flex-row justify-between gap-2 h-[45px] text-[16px] leading-21 font-medium -mx-[3px]">
      {/*{canMint && (*/}
      {/*  <button className="cb-border-h rounded-15 shadow-[#219653] bg-white text-[#219653] w-full">*/}
      {/*    Mint*/}
      {/*  </button>*/}
      {/*)}*/}
      <Link
        href={url}
        target="_blank"
        className="flex cb-border-h bg-white rounded-15 w-full justify-center items-center "
      >
        <p className="text-center">Metadata</p>
      </Link>
    </div>
  );
};

function ArtCardWrapper({ jobId }) {
  const [res, setRes] = useState({
    data: null,
    error: null,
    metadata: null,
  });
  const [successResult, setSuccessResult] = useState({
    data: null,
    error: null,
    metadata: null,
  });
  const loadingFinished = useMemo(() => {
    return res.data?.status === "Processed" || res.data?.status === "Discarded";
  }, [res.data?.status]);

  useEffect(() => {
    if (!jobId) return;

    let data;
    let error;
    let metadata;
    let timeout;
    const update = async () => {
      try {
        const res = await axios.get(`${API_URL}/job/${jobId}`);
        metadata = res;
        data = res.data;
        error = null;
      } catch (e) {
        error = e;
        console.error(e);
      } finally {
        setRes({
          data,
          error,
          metadata,
        });
        if (!loadingFinished) {
          timeout = setTimeout(update, 2000);
        }
      }
    };
    update().catch(() => {
      // noop
    });
    return clearTimeout(timeout);
  }, [jobId, setRes, loadingFinished]);

  useEffect(() => {
    if (res.data?.result?.status !== "Success") return;

    let metadataUrl;
    try {
      const output = JSON.parse(res.data.result.output);
      metadataUrl = output.data;
    } catch (e) {
      console.log(`job #${jobId} has no metadataUrl`);
    }
    if (!metadataUrl) return;

    let attempt = 0;
    let data;
    let error;
    let metadata;
    let timeout;
    const update = async () => {
      try {
        const res = await axios.get(metadataUrl);
        metadata = res;
        data = res.data;
        error = null;
      } catch (e) {
        error = e;
        console.error(e);
      } finally {
        setSuccessResult({
          data,
          error,
          metadata,
        });
        attempt += 1;
        if (attempt >= 50 && !data) {
          setTimeout(update, 6000);
        }
      }
    };
    update().catch(() => {
      // noop
    });
    return clearTimeout(timeout);
  }, [res.data?.result?.status]);

  return res.data ? (
    <ArtCard job={res.data} jobId={jobId} successResult={successResult} />
  ) : null;
}

function ArtCard({ jobId, job, successResult }) {
  const [minted, setMinted] = useState(false);
  const status = useMemo(() => {
    if (minted) {
      return "Minted";
    }
    if (job.status === "Processed") {
      return job.result?.status || "Error";
    }
    return job.status;
  }, [minted, job.status, job.result?.status]);

  const backgroundColor = useMemo(() => {
    return BG_COLOR_MAP[status];
  }, [status]);

  return (
    <div
      className="shadow-cb rounded-15 text-cb-normal h-[545px] w-[314px]"
      style={{ backgroundColor }}
    >
      <div className="flex flex-col mx-[18px] my-[19px] gap-2">
        <div className="flex justify-between leading-21 text-[14px] font-medium">
          <p>#{jobId}</p>
          <p>Status: {status}</p>
        </div>
        <div
          className="w-[284px] h-[284px] -mx-[3px] relative"
          style={{
            backgroundImage: `url(${
              status === "Error" ? "/ghost.svg" : "/bolt.svg"
            })`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            backgroundSize: "auto",
          }}
        >
          {successResult.data?.image && (
            <div
              className="w-full h-full absolute top-0 left-0  shadow-cb rounded-15"
              style={{
                ...(successResult.data?.image && {
                  backgroundImage: `url(${successResult.data?.image})`,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "center",
                  backgroundSize: "contain",
                }),
              }}
            />
          )}
          {successResult.data?.image && (
            <div className="absolute right-[6px] bottom-[9px] rounded-15 bg-white text-[#FF2828] font-medium leading-21">
              <div className="flex justify-between gap-[7px] mx-3 my-1">
                <p className="text-[14px] font-normal leading-21">❤️</p>
                <p className="text-[14px] text-[#FF2828] font-medium leading-21">
                  {job.likeCount || 0}
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="flex flex-col mt-1 gap-[6px]">
          <InfoLine title="Beneficiary" info={job.beneficiary} />
          <InfoLine
            title="Tx Block"
            info={
              <a href={`${ON_POLKADOT_QUERY_URL}${job.createdIn}`}>
                {job.createdIn}
              </a>
            }
          />
          <ActionArea
            setMinted={setMinted}
            minted={minted}
            job={job}
            status={status}
            url={`/imaginator/${jobId}`}
          />
        </div>
      </div>
    </div>
  );
}

export default ArtCardWrapper;

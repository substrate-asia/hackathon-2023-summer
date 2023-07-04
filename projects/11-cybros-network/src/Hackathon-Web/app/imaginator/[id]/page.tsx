"use client";
import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import {
  FAUCET_URL,
  GITHUB_URL,
  ON_POLKADOT_URL,
  ON_POLKADOT_QUERY_URL,
  dm_mono_font,
} from "@/constants";
import Link from "next/link";
import { WalletButton } from "@/components";
import { useRouter } from "next/navigation";
import { API_URL } from "@/constants";
import axios from "axios";

const utcDateFormmer = (tsStr: string) => {
  const date = new Date(Number(tsStr));
  return (
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short",
    }).format(date) + " (+UTC)"
  );
};

export default function Page({ params }: { params: { id: string } }) {
  interface PlaygroundCardTemplatePayload {
    title: string;
    info: string;
  }

  const PlaygroundInfo = ({ title, info }: PlaygroundCardTemplatePayload) => {
    return (
      <div className="flex flex-col justify-start gap-[3px]">
        <p className="font-medium leading-21 text-cb-normal ">{title}</p>
        <div className={dm_mono_font.className}>
          <p className="text-[13px] leading-[17px] text-cb-value line-clamp-2">
            {info}
          </p>
        </div>
      </div>
    );
  };

  const BlockInfo = ({
    title,
    block,
    info,
  }: PlaygroundCardTemplatePayload & { block: number }) => {
    return (
      <div className="flex flex-col justify-start gap-[3px]">
        <p className="font-medium leading-21 text-cb-normal">{title}</p>
        <Link href={ON_POLKADOT_QUERY_URL + block.toString()}>
          <div
            className={`${dm_mono_font.className}  text-[13px] leading-[17px] text-cb-value`}
          >
            <p className="   line-clamp-2">
              {`#${block}`}
              <br />
              {utcDateFormmer(info)}
            </p>
          </div>
        </Link>
      </div>
    );
  };

  const ProcessedInfo = (info: string) => {
    return (
      <div className="flex flex-col justify-start gap-[3px]">
        <p className="font-medium leading-21 text-cb-normal">Output</p>
        <div className={dm_mono_font.className}>
          <pre className="text-[13px] leading-[17px] text-cb-valuell">
            {info}
          </pre>
        </div>
      </div>
    );
  };

  const jobId = params.id;
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
  const router = useRouter();

  return (
    <div className=" text-black">
      <header className="flex flex-row justify-between mt-[45px] mx-[48px] h-[59px] text-cb-value">
        <div
          className="flex items-start gap-[21px]"
          onClick={() => router.push("/")}
        >
          <div className="w-[42px] h-[42px]">
            <Image src="/Logo Solo.svg" alt="" width={42} height={42} />
          </div>
          <div className="text-[24px] leading-[29px] mt-[18px]">
            Cybros | The Imaginator Demo
          </div>
        </div>
      </header>
      {res.data && (
        <div className="flex flex-col">
          <div className=" mt-[60px] mx-[105px]">
            <p className="text-4xl font-semibold leading-[44px]">
              Job #{jobId}
            </p>
            <p className="text-[17px] font-medium mt-[6px]">
              in Pool #{res.data.poolId}
            </p>
          </div>
          <div className="flex flex-row justify-between items-start mx-[84px] mt-9 gap-[21px]">
            <div className="shadow-cb rounded-15 shrink-0">
              <div className="flex flex-col items-start mx-8 mr-[172px] gap-6 mt-9 mb-[58px]">
                <BlockInfo
                  title="Job Created"
                  block={res.data.createdIn}
                  info={res.data.createdAt}
                />
                {res.data.assignment && (
                  <BlockInfo
                    title="Job Assigned"
                    block={res.data.assignment.createdIn}
                    info={res.data.assignment.createdAt}
                  />
                )}
                {res.data.result && (
                  <BlockInfo
                    title="Job Processed"
                    block={res.data.result.createdIn}
                    info={res.data.result.createdAt}
                  />
                )}
              </div>
            </div>

            <div className="shadow-cb rounded-15 flex-grow inline-block">
              <div className="flex flex-col gap-[18px] my-9 mx-[32px]">
                <PlaygroundInfo title="Block" info={res.data.createdIn} />
                <PlaygroundInfo
                  title="Timestamp"
                  info={utcDateFormmer(res.data.createdAt)}
                />
                <PlaygroundInfo
                  title="Job Depositor"
                  info={res.data.depositor}
                />
                <PlaygroundInfo
                  title="Impl Version"
                  info={res.data.implSpecVersion}
                />
                <PlaygroundInfo title="Job Status" info={res.data.status} />
                <PlaygroundInfo
                  title="Assigned Worker"
                  info={res.data.assignment?.assignee ?? "N/A"}
                />
                {ProcessedInfo(
                  successResult.metadata?.image ??
                    (res.data?.result?.output || "N/A")
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

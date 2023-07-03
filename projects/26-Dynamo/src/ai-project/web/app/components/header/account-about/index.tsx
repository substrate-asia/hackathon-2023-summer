"use client";
import { useTranslation } from "react-i18next";
import { XMarkIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import Link from "next/link";
import s from "./index.module.css";
import Modal from "@/app/components/base/modal";
import type { LangGeniusVersionResponse } from "@/models/common";
import { IS_CE_EDITION } from "@/config";

type IAccountSettingProps = {
  langeniusVersionInfo: LangGeniusVersionResponse;
  onCancel: () => void;
};
const buttonClassName = `
shrink-0 flex items-center h-8 px-3 rounded-lg border border-gray-200
text-xs text-gray-800 font-medium
`;
export default function AccountAbout({
  langeniusVersionInfo,
  onCancel,
}: IAccountSettingProps) {
  const { t } = useTranslation();
  const isLatest =
    langeniusVersionInfo.current_version ===
    langeniusVersionInfo.latest_version;

  return (
    <Modal isShow onClose={() => {}} className={s.modal}>
      <div className="relative">
        <XMarkIcon
          className="absolute top-0 -right-2 w-4 h-4 cursor-pointer"
          onClick={onCancel}
        />
        <div>
          <div
            className={classNames(
              s["logo-icon"],
              "mx-auto mb-3 w-12 h-12 bg-white rounded border border-gray-200"
            )}
          />
          <div className={classNames(s["logo-text"], "mx-auto mb-2")} />
          <div className="mb-3 text-center text-xs font-normal text-gray-500">
            Version {langeniusVersionInfo?.current_version}
          </div>
          <div className="mb-4 text-center text-xs font-normal text-gray-700">
            {/* <div>© 2023 Web3Go, Inc., Contributors.</div> */}
          </div>
        </div>
        <div className="mb-4 h-0 border-[0.5px] border-gray-200" />
        <div className="flex justify-between items-center">
          <div className="text-xs font-medium text-gray-800">
            {isLatest
              ? t("common.about.latestAvailable", {
                  version: langeniusVersionInfo.latest_version,
                })
              : t("common.about.nowAvailable", {
                  version: langeniusVersionInfo.latest_version,
                })}
          </div>
          <div className="flex items-center">
            <Link
              className={classNames(buttonClassName, 'mr-2')}
              href={'https://github.com/langgenius/dify/releases'}
              target='_blank'
            >
              {t("common.about.changeLog")}
            </Link>
            {!isLatest && !IS_CE_EDITION && (
              <Link
                className={classNames(buttonClassName, "text-primary-600")}
                href={langeniusVersionInfo.release_notes}
                target="_blank"
              >
                {t("common.about.updateNow")}
              </Link>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

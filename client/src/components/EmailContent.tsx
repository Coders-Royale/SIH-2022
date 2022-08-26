import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TimelineComponent from "./TimelineComponent";
import getTimeInYearMonthDayMinutes from "./MiddleBarComponent";

import { useDocument } from "../queries/hooks";
import {
  useMutateAssignDocument,
  useMutateRejectDocument,
  useMutateApproveDocument,
} from "../queries/mutations";

import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SendIcon from "@mui/icons-material/Send";
import Man from "../images/man.svg";
import GreenTick from "../images/icons/tracking_page_green_tick.svg";
import Clock from "../images/icons/tracking_page_clock.svg";
import Email1 from "../images/tracking_page_email_1.png";
import Email2 from "../images/tracking_page_email_2.png";
import Email3 from "../images/tracking_page_email_3.png";
import Dp from "../images/profile_page_dp.png";
import PDFIcon from "./PDFIcon";
import ActionsButton from "./buttons/ActionsButton";
import { AppContext, COLORS } from "../App";

enum Status {
  Pending = "Pending",
  Forwarded = "Forwarded",
  Rejected = "Rejected",
  Approved = "Approved",
}

interface Props {
  selectedMid: number;
  setSelectedMid: (selected: number) => void;
  type: string;
  emailContent: any;
  statuses?: any[];
  documentId?: string;
}

export default function EmailContent({
  selectedMid,
  setSelectedMid,
  type,
  emailContent,
  statuses,
  documentId,
}: Props) {
  const navigate = useNavigate();
  const [additionalMessage, setAdditionalMessage] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [mainFiles, setMainFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const { theme, setTheme } = useContext(AppContext);

  interface Error {
    type: string;
    message: string;
  }
  const [errors, setErrors] = useState<Error[]>([]);

  let [isOpenApprove, setIsOpenApprove] = useState(false);
  let [isOpenForward, setIsOpenForward] = useState(false);
  let [isOpenReject, setIsOpenReject] = useState(false);

  var errLength = 0;

  const validate = () => {
    errLength = 0;
    setErrors([]);

    if (additionalMessage === "") {
      setErrors((errors: Error[]) => [
        ...errors,
        { type: "additionalMessage", message: "Please enter something!" },
      ]);
      errLength++;
    }

    if (errLength === 0) return true;

    return false;
  };

  const { mutateAsync: useAssignDocument } = useMutateAssignDocument({
    onSuccess: (data: any) => {
      if (data.message === "Document assigned successfully") {
        setMessage(data.message);
        setLoading(false);
      } else {
        setErrors((errors: Error[]) => [
          ...errors,
          { type: "unknown", message: data.message },
        ]);
        setLoading(false);
      }
    },
    onError: () => {
      setErrors((errors: Error[]) => [
        ...errors,
        { type: "unknown", message: "Unknown error" },
      ]);
    },
    onMutate: () => {
      setLoading(true);
    },
  }) as unknown as { mutateAsync: (data: any) => Promise<any> };

  const { mutateAsync: useRejectDocument } = useMutateRejectDocument({
    onSuccess: (data: any) => {
      if (data.message === "Document rejected successfully") {
        setMessage(data.message);
        setLoading(false);
      } else {
        setErrors((errors: Error[]) => [
          ...errors,
          { type: "unknown", message: data.message },
        ]);
        setLoading(false);
      }
    },
    onError: () => {
      setErrors((errors: Error[]) => [
        ...errors,
        { type: "unknown", message: "Unknown error" },
      ]);
    },
    onMutate: () => {
      setLoading(true);
    },
  }) as unknown as { mutateAsync: (data: any) => Promise<any> };

  const { mutateAsync: useApproveDocument } = useMutateApproveDocument({
    onSuccess: (data: any) => {
      if (data.message === "Document approved successfully") {
        setMessage(data.message);
        setLoading(false);
      } else {
        setErrors((errors: Error[]) => [
          ...errors,
          { type: "unknown", message: data.message },
        ]);
        setLoading(false);
      }
    },
    onError: () => {
      setErrors((errors: Error[]) => [
        ...errors,
        { type: "unknown", message: "Unknown error" },
      ]);
    },
    onMutate: () => {
      setLoading(true);
    },
  }) as unknown as { mutateAsync: (data: any) => Promise<any> };

  const documentInfo = useDocument({
    documentId: documentId ?? emailContent?.content.split("documentId=")[1],
    employeeId: localStorage.getItem("empId"),
    role: localStorage.getItem("empId")![0] == "A" ? "admin" : "employee",
  });

  useEffect(() => {
    if (documentInfo.data) {
      setMainFiles(documentInfo?.data?.data?.main_file);
    }
  }, [documentInfo.isSuccess === true]);

  return (
    <div
      className={`w-full overflow-scroll px-10 ${
        theme === "Dark" ? "bg-gray-850" : "bg-white"
      } min-h-screen transition-all`}
    >
      {/*NAVIGATOR*/}
      {type === "sent" ? (
        <div className="mt-16 flex flex-row justify-end">
          <div className="flex flex-row gap-4 items-center">
            <h1
              className={`text-sm font-normal ${
                theme === "Dark" ? "text-gray-150" : "text-gray-750"
              } transition-all`}
            >
              1 of 50
            </h1>
            <div className="px-4 py-3 rounded-lg border border-gray-450 flex flex-row">
              <button className="pr-4">
                <ChevronLeftIcon />
              </button>
              <button className="pl-4 border-l-1 border-gray-450">
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div
        className={`${
          type === "sent" ? "mt-6" : "mt-12"
        } flex flex-row justify-between`}
      >
        <div className="flex flex-row gap-4">
          <img src={Man} alt="man" className="rounded-full w-[60px] h-[60px]" />
          <div className="">
            {type === "sent" ? (
              <h1
                className={`text-sm font-semibold ${
                  theme === "Dark" ? "text-gray-150" : "text-gray-750"
                } transition-all`}
              >
                To: Himanshu Chittora{" "}
                <span>
                  <KeyboardArrowDownIcon fontSize="small" />
                </span>
              </h1>
            ) : (
              <h1
                className={`text-sm font-semibold ${
                  theme === "Dark" ? "text-gray-150" : "text-gray-750"
                } transition-all`}
              >
                From: {emailContent?.senderName}
                <span>
                  <KeyboardArrowDownIcon fontSize="small" />
                </span>
              </h1>
            )}
            <h1
              className={`text-3xl font-normal ${
                theme === "Dark" ? "text-gray-150" : "text-gray-750"
              } transition-all`}
            >
              {emailContent?.subject}
            </h1>
          </div>
        </div>

        <h1 className="font-semibold text-sm text-gray-550">3 hours ago</h1>
      </div>

      {/*CURRENT STATUS*/}
      {type === "sent" ? (
        <div className="pl-[76px] mt-8">
          <h1
            className={`text-sm font-semibold ${
              theme === "Dark" ? "text-gray-150" : "text-gray-750"
            } transition-all tracking-widest`}
          >
            CURRENT STATUS
          </h1>
          <div className="flex flex-row mt-4 items-center gap-2">
            <img src={GreenTick} alt="green-tick" className="w-4 h-4" />
            <h1 className="text-sm font-medium text-gray-650">
              <span className="text-green-550 text-base">Approved</span> by Mr.
              Venkatesh Iyer
            </h1>
          </div>

          <div className="flex flex-row mt-1 items-center gap-2">
            <img src={Clock} alt="clock" className="w-4 h-4" />
            <h1 className="text-xs font-medium text-gray-550">
              1:30 PM, 11 July, 2022 (Monday)
            </h1>
          </div>
        </div>
      ) : null}

      {/*TRACKING*/}
      {type === "sent" ? (
        <div className="pl-[76px] mt-8">
          <h1
            className={`text-sm font-semibold ${
              theme === "Dark" ? "text-gray-150" : "text-gray-750"
            } transition-all tracking-widest`}
          >
            TRACKING
          </h1>
          <div className="mt-4">
            {statuses &&
              statuses.map((item, index) => (
                <TimelineComponent
                  index={index}
                  name={item.employeeName}
                  time={getTimeInYearMonthDayMinutes(item.time_elapsed)
                    .toString()
                    .slice(0, -4)}
                  date={new Date(item?.time_returned).toLocaleDateString()}
                  status={item.status}
                  remarks={item.rejection_reason}
                />
              ))}
          </div>
        </div>
      ) : null}

      {/*EMAIL CONTENT*/}
      <div className={`pl-[76px] ${type === "sent" ? "mt-16" : ""}`}>
        {type === "sent" ? (
          <h1
            className={`text-sm font-semibold ${
              theme === "Dark" ? "text-gray-150" : "text-gray-750"
            } transition-all tracking-widest`}
          >
            EMAIL CONTENT
          </h1>
        ) : null}
        <div
          className={`text-sm pt-4 items-center whitespace-pre-line font-normal ${
            theme === "Dark" ? "text-gray-150" : "text-gray-750"
          } transition-all`}
        >
          {emailContent?.description ??
            emailContent?.content.split("documentId=")[0]}
        </div>
        {/* <div className="pt-4 flex flex-row gap-8">
          <img src={Email1} alt="" className="w-1/3" />
          <img src={Email2} alt="" className="w-1/3" />
          <img src={Email3} alt="" className="w-1/3" />
        </div> */}
      </div>

      {/*PDF FILES DISPLAY*/}
      <div className="mt-12">
        <div className="grid grid-cols-6">
          {mainFiles?.map((item, index) => (
            <PDFIcon key={index} file={item} />
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="pl-[76px] flex item-center justify-between mt-8 gap-4">
        <ActionsButton
          bgColor="bg-green-150"
          textColor="text-green-550"
          borderColor="border-green-550"
          text="Approve"
          isOpen={isOpenApprove}
          setIsOpen={setIsOpenApprove}
          clickFunction={useApproveDocument}
          documentId={
            documentId ?? emailContent?.content.split("documentId=")[1]
          }
        />
        <ActionsButton
          bgColor="bg-blue-25"
          textColor="text-blue-350"
          borderColor="border-blue-350"
          text="Forward"
          isOpen={isOpenForward}
          setIsOpen={setIsOpenForward}
          clickFunction={useAssignDocument}
          documentId={
            documentId ?? emailContent?.content.split("documentId=")[1]
          }
        />
        <ActionsButton
          bgColor="bg-red-150"
          textColor="text-red-550"
          borderColor="border-red-550"
          text="Reject"
          isOpen={isOpenReject}
          setIsOpen={setIsOpenReject}
          clickFunction={useRejectDocument}
          documentId={
            documentId ?? emailContent?.content.split("documentId=")[1]
          }
        />
      </div>

      {/*ADDITIONAL MESSAGE*/}
      <div className="pl-[76px] mt-4 mb-8 grid grid-cols-6 gap-4">
        <div className="col-span-5">
          <div className="bg-gray-150 border border-gray-450 rounded-lg h-11 flex flex-row w-full">
            <div className="pl-4 py-3">
              <img src={Dp} alt="profile_dp" className="w-5 h-5 rounded-full" />
            </div>
            <input
              className="bg-gray-150 my-auto mx-2 px-2 text-sm w-full"
              placeholder="Additional Message"
              onChange={(e) => setAdditionalMessage(e.target.value)}
            ></input>
          </div>
          <div className="mt-1 mb-1 text-left">
            {errors.length > 0
              ? errors.map((item, index) => {
                  if (item.type === "additionalMessage") {
                    return (
                      <p className="text-red-500 text-xs" key={index}>
                        {item.message}
                      </p>
                    );
                  }
                })
              : null}
          </div>
        </div>
        <div className="col-span-1">
          <button
            className="bg-gradient-to-r from-blue-450 to-blue-150 text-white py-2 h-11 w-full rounded-lg font-semibold"
            onClick={(e) => {
              validate() && navigate("/");
            }}
          >
            <SendIcon fontSize="small" className="mb-1" /> Send
          </button>
        </div>
      </div>
    </div>
  );
}

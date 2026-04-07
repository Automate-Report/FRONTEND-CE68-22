import ReportCheckmark from "../icon/ReportCheckmark";
import Link from "next/link";
import NotiBlob from "../icon/NotiBlob"

interface NotiProps {
    projectName: string;
    hyperlink: string;
    status: string;
}

export default function NotiReportdone({ projectName, hyperlink, status }: NotiProps) {
    return (
        <Link href={hyperlink}>
            <div className="bg-[#07131A] flex items-center justify-center hover:bg-[#272D31]">
                <div className="p-4 flex gap-4 max-w-4xl w-full">

                    {/* Icon Circle */}
                    <div className="w-[48px] h-[48px] rounded-full bg-[#2B3A42] flex items-center justify-center flex-shrink-0 relative z-10">
                        {/* Unread red dot */}
                        { status == "unread" && (
                        <div className="absolute top-0 right-0 text-white">
                            <NotiBlob />
                        </div>
                        )}
                        <ReportCheckmark />
                    </div>


                    {/* Text */}
                    <div>
                        <h2 className="text-white text-xl font-semibold mb-2">
                            Your report is ready!
                        </h2>

                        <p className="text-[#C9D4DC]">
                            We’ve created your report and it’s ready to view in{" "}
                            <span className="text-white">
                                “{projectName}”
                            </span>
                        </p>
                    </div>

                </div>
            </div>
        </Link>
    );
};
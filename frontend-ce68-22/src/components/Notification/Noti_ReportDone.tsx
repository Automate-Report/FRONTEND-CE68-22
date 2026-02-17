import ReportCheckmark from "../icon/ReportCheckmark";
import Link from "next/link";

interface NotiProps {
    projectName: string;
    hyperlink: string;
}

export default function NotiReportdone({ projectName, hyperlink }: NotiProps) {
    return (
        <Link href={hyperlink}>
            <div className="bg-[#07131A] flex items-center justify-center hover:bg-[#272D31]">
                <div className="p-4 flex gap-4 max-w-4xl w-full">

                    {/* Icon Circle */}
                    <div className="w-[48px] h-[48px] rounded-full bg-[#2B3A42] flex items-center justify-center flex-shrink-0">
                        <ReportCheckmark />
                    </div>

                    {/* Text */}
                    <div>
                        <h2 className="text-white text-xl font-semibold mb-3">
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
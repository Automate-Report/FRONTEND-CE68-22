// Before Using the card will look like this:
// I------------------------I
// I [      ]   Title       I
// I [ icon ]  Data Display I
// I [      ]  Description  I
// I------------------------I
interface CardWithIconProps {
    icon: React.ReactNode;
    title: string;
    dataDisplay: string;
    description: string;
    descriptioncolor?: string; // Optional prop for description text color
}


export default function CardWithIcon({ icon, title, dataDisplay, description, descriptioncolor="#404F57" }: CardWithIconProps) {
    const isDescriptionEmpty = (description === '')
    return (
        <div className="flex flex-row items-center rounded-xl border border-[rgba(64,79,87,0.4)] w-full h-full p-4 gap-6">
            <div className="flex items-center justify-center w-14 h-full bg-[#272D31] rounded-xl">
                {icon}
            </div>
            <div className="flex flex-col justify-center h-full">
                <span className="font-bold text-sm text-[#96A6A6] tracking-wider leading-5 pb-1">{title}</span>
                <span className="font-semibold text-xl pb-1">{dataDisplay}</span>
                <span className={`text-xs text-[${descriptioncolor}] ${isDescriptionEmpty ? 'hidden' : ''}`}>{description}</span>
            </div>
        </div>
    );
}
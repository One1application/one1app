import { MessageCircle } from "lucide-react";
import { FaTelegramPlane } from "react-icons/fa";

export const HomePageConfig = {
    title: "Hello, OneApp Creator!",
    noticeText: "Welcome to OneApp. OneApp is designed to make your experience seamless, efficient, and enjoyable.",
    telegram: {
        icon: FaTelegramPlane,
        title: "Join Our Telegram Channel",
        description: "A community of 10k+ aspiring creators.",
        link: "#",
        buttonLabel: "Join Now",
        buttonColor: "bg-orange-500",
        textColor: "text-black"
    },
    whatsApp: {
        icon: MessageCircle,
        title: "Insider WhatsApp Community",
        description: "Exclusive content and pro creator tips.",
        link: "#",
        buttonLabel: "Unlock Access",
        buttonColor: "bg-green-500",
        textColor: "text-white"
    }
};

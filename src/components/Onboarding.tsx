import HeroGeometric from "./Hero.tsx";

interface OnboardingProps {
    onComplete: () => void
}

export default function Onboarding({ onComplete }: OnboardingProps) {
    return <HeroGeometric  title1="Docker made" title2="Easy" onComplete={onComplete} />
}


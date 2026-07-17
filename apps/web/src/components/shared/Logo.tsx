type Props = {
  className?: string
}

export function Logo({ className }: Props) {
  return <img src="/LOGO.svg" alt="EconoMeal" className={className} />
}

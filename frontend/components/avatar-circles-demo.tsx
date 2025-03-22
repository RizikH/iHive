"use client";

import { AvatarCircles } from "@/components/magicui/avatar-circles"

const avatars = [
  {
    imageUrl: "/Images/sample.jpeg",
    profileUrl: "#",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59442788",
    profileUrl: "#",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/106103625",
    profileUrl: "#",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/59228569",
    profileUrl: "#",
  },
  {
    imageUrl: "https://avatars.githubusercontent.com/u/89768406",
    profileUrl: "#",
  },
]

export default function AvatarCirclesDemo() {
  return <AvatarCircles numPeople={99} avatarUrls={avatars} />
}


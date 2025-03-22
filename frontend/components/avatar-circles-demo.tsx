"use client";

import { AvatarCircles } from "@/components/magicui/avatar-circles"

// =============================================
// Sample Avatar Data
// =============================================

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

// =============================================
// Avatar Circles Component
// =============================================

export default function AvatarCirclesDemo() {
  // Render the avatar circles component with sample data
  return <AvatarCircles numPeople={99} avatarUrls={avatars} />
}


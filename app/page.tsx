"use client"

import { panchang, geistSans } from "./fonts";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { UserIcon, MailAtSign01Icon, X, Linkedin02Icon, Telephone, InstagramIcon, WorkIcon, Home01Icon, ArrowBigLeftDashIcon, ArrowBigRightDashIcon, Download02Icon, SpaceshipIcon, GithubIcon, GameIcon, GameController03Icon } from "@hugeicons/core-free-icons";
import { useEffect, useState } from "react";
import gsap from "gsap";
import Matter from "matter-js";
import Lenis from "lenis";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import dynamic from 'next/dynamic';
import Pill from './components/PILL';

// Belt-and-suspenders alongside the dynamic import already inside
// PhysicsCanvas: this keeps p5 out of the server bundle entirely.
const PhysicsCanvas = dynamic(() => import('./components/PhysicsCanvas'), {
  ssr: false,
});

// x/y are percentages (0–100) of the container so they scale to any viewport
const SKILLS = [
  { word: 'React', background: '#61DAFB', x: 75, y: 6, rotation: -8, width: 130 },
  { word: 'Next.js', background: '#1C1B29', x: 31, y: 20, rotation: 6, width: 150 },
  { word: 'TypeScript', background: '#3178C6', x: 15, y: 35, rotation: -4, width: 170 },
  { word: 'Matter.js', background: '#6C5CE7', x: 45, y: 9, rotation: 10, width: 180 },
  { word: 'p5.js', background: '#ED225D', x: 88, y: 30, rotation: -12, width: 120 },
  { word: 'Tailwind', background: '#06B6D4', x: 5, y: 23, rotation: 3, width: 150 },
  { word: 'JavaScript', background: '#F0DB4F', x: 26, y: 45, rotation: -8, width: 150 },
  { word: 'Nodejs', background: '#68A063', x: 40, y: 50, rotation: 6, width: 150 },
  { word: 'Expressjs', background: '#353535', x: 12, y: 55, rotation: -4, width: 170 },
  { word: 'Python', background: '#306998', x: 85, y: 43, rotation: 10, width: 160 },
  { word: 'Firebase', background: '#FFCA28', x: 6, y: 67, rotation: -12, width: 130 },
  { word: 'FastApi', background: '#009688', x: 34, y: 63, rotation: 3, width: 150 },
  { word: 'Git', background: '#F05032', x: 48, y: 70, rotation: -8, width: 130 },
  { word: 'GitHub', background: '#24292E', x: 90, y: 77, rotation: 6, width: 150 },
  { word: 'Mongodb', background: '#47A248', x: 7, y: 87, rotation: -4, width: 170 },
  { word: 'PostgreSQL', background: '#336791', x: 38, y: 82, rotation: 10, width: 180 },
  { word: 'Supabase', background: '#3ECF8E', x: 53, y: 58, rotation: -12, width: 120 },
  { word: 'Redis', background: '#DC382D', x: 65, y: 90, rotation: 3, width: 150 },
  { word: 'Chartjs', background: '#FF6384', x: 44, y: 25, rotation: -8, width: 130 },
  { word: 'vercel', background: '#111111', x: 75, y: 13, rotation: 6, width: 150 },
  { word: 'CRON', background: '#A855F7', x: 9, y: 43, rotation: 10, width: 160 },
  { word: 'Motion', background: '#A855F7', x: 65, y: 43, rotation: 10, width: 170 },
];

export default function Home() {
  const [loading, setLoading] = useState(true)

  // Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    if (loading) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }

  }, [loading])

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(".words p", {
        yPercent: 1000,
      });

      const tl = gsap.timeline({
        defaults: {
          ease: "power2.out",
        },
      });

      tl.to(".words p", {
        yPercent: 0,
        duration: 0.6,
        stagger: 0.08,
        delay: 1.5,
      }).to(".words p", {
        yPercent: -1000,
        duration: 1.5,
        stagger: 0.08,
        delay: 1
      }).to(".loader", {
        yPercent: -100,
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => setLoading(false),
      });
    });

    return () => ctx.revert();
  }, []);



  const projects: { notworking: string, title: string, description: string, image: string, github: string, live: string, tags: string[], video: string }[] = [
    {
      notworking: "",
      title: "WhatsappWraped",
      description: "Spotify wrapped but for whatsapp chats",
      image: "/whatappwrapped_image.png",
      github: "https://github.com/OgunwandeBukunmi/whatsappwrapped",
      live: "https://whatsappwrapped-omega.vercel.app/",
      tags: ["Python", "Fast API", "ReactJS"],
      video: "/whatsappwrapped_video.mp4"
    },

    {
      notworking: "",
      title: "Kristina- a writers portfolio",
      description: "A well detailed portfolio for Kristina, a writer, with a clean and simple interface",
      image: "/kristina_image.png",
      github: "https://github.com/OgunwandeBukunmi/kristina",
      live: "https://kristina-topaz.vercel.app/",
      tags: ["ReactJS", "Tailwind CSS", "Firebase"],
      video: "/kristina_video.mp4"
    },

    {
      notworking: "",
      title: "Give oluwabukunmi Money",
      description: "A funny but useful website for sending me money",
      image: "/givememoney_image.png",
      github: "https://github.com/OgunwandeBukunmi/giveoluwabukunmimoney",
      live: "https://giveoluwabukunmimoney.vercel.app/",
      tags: ["html", "css", "js"],
      video: "/givememoney_video.mp4"
    },

    {
      notworking: "",
      title: "Credo Auth",
      description: "A Nodejs authentication library",
      image: "/credoauth_image.png",
      github: "https://github.com/OgunwandeBukunmi/credo_docs",
      live: "https://credo-docs.vercel.app/",
      tags: ["Nodejs", "ExpressJS", "MongoDB"],
      video: "/credoauth_video.mp4"
    },
    {
      notworking: "",
      title: "Psamuel- an artists porfolio",
      description: "A portfolio for a skilled digital artist and animator",
      image: "/psamuel_image.png",
      github: "https://github.com/OgunwandeBukunmi/Psamuel",
      live: "https://psamuel.vercel.app/",
      tags: ["ReactJS", "Tailwind CSS", "Firebase"],
      video: "/psamuel_video.mp4"
    },
    {
      title: "NewYearResolution Guide",
      description: "A simple app for giving users steps and advices to achieve their new year goal",
      image: "/newyearesolution_image.png",
      github: "https://github.com/OgunwandeBukunmi/NewYearResolutionFrontend",
      live: "https://new-year-resolution-guide.vercel.app/",
      notworking: "Server down",
      tags: ["ReactJS", "Tailwind CSS", "Firebase"],
      video: ""
    },
    {
      notworking: "",
      title: "Flexiform",
      description: "Google forms younger brother",
      image: "/flexiform_image.png",
      github: "https://github.com/OgunwandeBukunmi/FlexiForm",
      live: "https://flexiform-o812.vercel.app/",
      tags: ["Reactjs", "Firebase", "Tailwind CSS"],
      video: "/flexiform_video.mp4"
    },
    {
      notworking: "",
      title: "Iphone 16 color picker",
      description: "Before you buy an iphone 16",
      image: "/iphone16_image.png",
      github: "https://github.com/OgunwandeBukunmi/threejs-iphone16-colorpicker",
      live: "https://iphone16-colorpicker.vercel.app/",
      tags: ["reactjs", "3js"],
      video: "/iphone16_video.mp4"
    },
    {
      notworking: "",
      title: "WEB3 Wallet Profile viewer",
      description: "An analysis of the content and balances in a crypot wallet",
      image: "/walletprofileviewer_image.png",
      github: "https://github.com/OgunwandeBukunmi/web3-profile-viewer",
      live: "https://web3wallet.onrender.com",
      tags: ["reactjs", "web3", "Ethers.js"],
      video: "/walletviewer_video.mp4"
    }
  ]

  const activity = [
    {
      title: "Hackaton Participant",
      name: "SwiftyEX hackaton",
      date: "May 2026 to June 2026"
    },
    {
      title: "Freelance Developer",
      name: "Kristina",
      date: "september 2025 to febuary 2026"

    },
    {
      title: "Freelance Developer",
      name: "University Hub",
      date: "December 2025 to January 2026"

    }

  ]

  const skills: string[] = ["HTML", "CSS", "javaScript", "ReactJS", "NextJS", "Git", "GitHub", "Figma", "Tailwind CSS", ""] // and many more

  const experience = [{
    Project: "Krisitna",
    review: "",
    story: "Build a Portfolio for her"
  },
  {

  }

  ]

  return (
    <>
      {/* loeader */}
      <section className="fixed inset-0 w-screen h-[200vh] bg-red-500 z-50 loader overflow-hidden flex items-center justify-center">

        <div className="words flex flex-row items-center justify-center gap-2 ">
          <p className={`${panchang.className} md:text-8xl text-4xl font-extrabold tracking-widest leading-tight`}>W</p>
          <p className={`${panchang.className} md:text-8xl text-4xl font-extrabold tracking-widest leading-tight`}>A</p>
          <p className={`${panchang.className} md:text-8xl text-4xl font-extrabold tracking-widest leading-tight`}>Y</p>
          <p className={`${panchang.className} md:text-8xl text-4xl font-extrabold tracking-widest leading-tight`}>N</p>
          <p className={`${panchang.className} md:text-8xl text-4xl font-extrabold tracking-widest leading-tight`}>E</p>
        </div>

      </section>


      {/* navbar */}
      <section className="fixed z-100 bg-black opacity-80 p-4 rounded-2xl backdrop-blur-2xl top-5 right-8">
        <nav className="flex flex-row items-center gap-4">
          <HugeiconsIcon
            icon={Home01Icon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}

          />
          <HugeiconsIcon
            icon={UserIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}

          />
          <HugeiconsIcon
            icon={WorkIcon}
            size={24}
            color="currentColor"
            strokeWidth={1.5}

          />

        </nav>
      </section>


      {/* hero */}
      <section className="relative min-h-screen w-full flex flex-col-reverse md:flex-row items-center justify-center gap-12 px-6 md:px-12 py-16">

        {/* Grid overlay */}
        <div
          className="pointer-events-none absolute inset-0 -z-5"
          style={{
            backgroundImage:
              'linear-gradient(to right, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.06) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        {/* Left */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="flex flex-col items-center">

            <Image
              src="/profile.jpg"
              alt="Profile"
              width={340}
              height={340}
              className="rounded-3xl object-cover shadow-2xl w-64 h-64 md:w-80 md:h-80"
            />

            {/* Socials */}
            <div className="flex items-center justify-center gap-6 mt-8">

              <button className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 transition">
                <HugeiconsIcon icon={MailAtSign01Icon} size={22} />
              </button>

              <button className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 transition">
                <HugeiconsIcon icon={X} size={20} />
              </button>

              <button className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 transition">
                <HugeiconsIcon icon={Linkedin02Icon} size={20} />
              </button>

              <button className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 transition">
                <HugeiconsIcon icon={Telephone} size={20} />
              </button>

              <button className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 transition">
                <HugeiconsIcon icon={InstagramIcon} size={20} />
              </button>
              <button className="p-3 rounded-full bg-neutral-900 hover:bg-neutral-800 transition">
                <HugeiconsIcon icon={GithubIcon} size={20} />
              </button>



            </div>

          </div>
        </div>

        {/* Right */}
        <div className="w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left">

          <h1
            className={`${panchang.className}
      text-6xl
      sm:text-8xl
      font-extrabold
      leading-none py-4`}
          >
            Wayne
          </h1>

          <div className="flex items-center gap-3 mt-6 bg-neutral-900 rounded-lg p-4 w-full md:w-fit">

            <span className="w-1.5 h-12 bg-[#E2725B] rounded-full" />

            <p className={`${geistSans.className} text-lg md:text-xl font-semibold`}>
              I build things.
            </p>

          </div>

          <p
            className={`${geistSans.className}
      mt-8
      max-w-xl
      text-lg
      md:text-xl
      text-neutral-400
      leading-relaxed`}
          >
            <span className={`${panchang.className} text-[#E2725B] text-3xl`}>
              "
            </span>

            I'm not lazy, I'm just on energy-saving mode.

            <span className={`${panchang.className} text-[#E2725B] text-3xl`}>
              "
            </span>
          </p>

          <button
            className="mt-10 flex items-center gap-3 rounded-full bg-white px-8 py-4 hover:scale-105 transition"
          >
            <HugeiconsIcon
              icon={Download02Icon}
              size={22}
              color="black"
            />

            <span
              className={`${panchang.className} text-black font-bold`}
            >
              Download CV
            </span>

          </button>

        </div>

      </section>

      {/* projects */}
      <section className="min-h-screen w-full flex flex-col items-center py-16 px-4 ">

        <div>
          <h1 className={`${panchang.className} text-4xl  md:text-7xl font-extrabold tracking-widest leading-tight my-8`}>
            Projects
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 p-4">
            {projects.map((project, index) => (
              <div
                key={index}
                className="group overflow-hidden border border-[#E2725B] bg-zinc-900/50 backdrop-blur-sm transition-all duration-300 hover:-translate-y-2 hover:border-white/30"
              >
                {/* Project Image */}
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Tags */}
                  <div className="absolute bottom-4 left-4 flex flex-wrap gap-2">
                    {project.tags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-black/70 px-3 py-1 text-xs text-white backdrop-blur-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col  justify-around">
                  <h2
                    className={`${panchang.className} relative text-3xl font-bold text-white break-words `}
                  >
                    {project.title}
                    <span className={`${geistSans.className} absolute bottom-0 right-0 text-xs text-red-500`}>{project.notworking ? ` (${project.notworking})` : ""}</span>
                  </h2>

                  <p
                    className={`${geistSans.className} text-zinc-400 leading-relaxed`}
                  >
                    {project.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-4 pt-2">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-white px-5 py-2 text-sm font-semibold text-black transition hover:bg-zinc-200"
                    >
                      Live Demo
                    </a>

                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full border border-zinc-700 px-5 py-2 text-sm text-white transition hover:border-white"
                    >
                      GitHub
                    </a>

                    <button className="group p-2 border-1 border-[#E2725B] hover:bg-white transition-all transition-300 ">
                      <HugeiconsIcon
                        icon={SpaceshipIcon}
                        size={24}
                        color="white"
                        strokeWidth={2.5}
                        className="group-hover:cursor-pointer group-hover:text-red-500 transition-all transition-300"
                      />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>


      <section className="skills-footer min-h-screen w-full">
        <PillPhysicsDemo />
      </section>



      {/* experience https://www.youtube.com/watch?v=qqq4E6PU2vQ */}
      <section className="min-h-screen w-full py-8">
        <div className="flex items-center justify-center">
          <h1
            className={`${panchang.className}
            relative
          text-center
      text-4xl
      sm:text-6xl
      font-extrabold
      tracking-widest
      inline-block`}
          >
            EXP <span className={`${panchang.className} text-[#E2725B] text-2xl`}>Points</span>

            <button className="absolute top-0 -left-10  p-3 rounded-full ">
              <HugeiconsIcon icon={GameIcon} size={20} />
            </button>
            <button className="absolute top-5 -right-10 p-3 rounded-full ">
              <HugeiconsIcon icon={GameController03Icon} size={20} />
            </button>
          </h1>
        </div>

      </section>

      {/* footer  https://www.youtube.com/watch?v=qqq4E6PU2vQ */}
      {/* <footer></footer> */}
    </>



  );
}


export function PillPhysicsDemo() {
  return (
    <main className="relative min-h-[70vh] overflow-hidden  ">
      {/* z-20 keeps real UI clickable above the canvas (z-10) below it */}
      <div className="absolute inset-0 flex  justify-center -z-20 pointer-events-none">
        <h1
          className={`${panchang.className}
      text-6xl
      sm:text-[150px]
      opacity-50
      font-extrabold
      tracking-widest`}
        >
          SKILLS
        </h1>
      </div>


      {/* Pills + canvas share `main` as their positioned ancestor, so they
          get the full min-h-screen area to fall and settle in. */}
      {SKILLS.map((pill) => (
        <Pill key={pill.word} textColor="#FFFFFF" {...pill} />
      ))}
      <PhysicsCanvas />
    </main>
  );
}
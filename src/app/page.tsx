import Image from "next/image";
import UserDetails from "@/components/UserDetails";
import AuthButtons from "@/components/AuthButtons";

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={180}
          height={38}
          priority
        />
        <h1 className="text-2xl font-bold mb-8">Next.js Auth Boilerplate</h1>

        <div className="w-full max-w-md">
          <UserDetails />
          <AuthButtons />
        </div>
      </main>
    </div>
  );
}

import LoginForm from "@/components/LoginForm";
import Image from "next/image";
import Logo from "@/assets/Logo.svg";
import Car from "@/assets/Car.svg";

export default function LoginPage() {
  return (
    <div className="container min-h-screen">
      <div className="flex items-center justify-center min-h-screen w-full mx-auto px-4 py-8">
        <div className="w-[50%] flex flex-col items-center justify-center gap-10">
          <Image src={Logo} alt="Logo" width={400} />
          <Image src={Car} alt="Car" width={600} />
        </div>
        <div className="w-[50%]">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}

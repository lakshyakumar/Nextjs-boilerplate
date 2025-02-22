import SignupForm from "@/components/SignupForm";
import Image from "next/image";
import Logo from "@/assets/Logo.svg";
import Car from "@/assets/Car.svg";

export default function SignUpPage() {
  return (
    <div className="container min-h-screen">
      <div className="flex flex-col lg:flex-row items-center justify-center min-h-screen w-full mx-auto px-4 lg:py-8 py-4">
        <div className="w-full lg:w-[50%] flex flex-col items-center justify-center gap-5 lg:gap-10 mb-2 lg:mb-0">
          <Image
            src={Logo}
            alt="Logo"
            className="w-[200px] md:w-[300px] lg:w-[400px] h-auto"
          />
          <Image
            src={Car}
            alt="Car"
            className="w-[250px] md:w-[400px] lg:w-[600px] h-auto"
          />
        </div>
        <div className="w-full lg:w-[50%] px-4">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}

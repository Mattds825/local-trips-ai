import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import React from "react";

const Header = () => {
  return (
    <header className="absolute  z-50 top-4 right-4">
      <div className="text-lg text-slate-600 border px-2 py-1 rounded-md hover:text-slate-800 hover:border-slate-800 hover:tracking-widest transition-all duration-300">
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>        
      </div>      
    </header>
  );
};

export default Header;

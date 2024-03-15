import React from "react";
import { TextInput, Label, Button } from "flowbite-react";
import { Link } from "react-router-dom";

const Login = () => {
  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto  flex-col md:flex-row md:items-center gap-5">
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
              idri's
            </span>
            Shop
          </Link>
          <p className="text-sm mt-5">
            This is a demo project. You can sign up with your email and password
            or with Google.
          </p>
        </div>
        <div className="flex-1">
          <form className="flex flex-col gap-4">
            <div>
              <Label value="Your email" />
              <TextInput
                type="email"
                placeholder="name@company.com"
                id="email"
              />
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type="password" placeholder="password" id="password" />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit">
              Log In
            </Button>
          </form>
          <div className="flex items-center gap-2 text-sm mt-5">
            <span>I Dont Have an Account</span>
            <Link className="text-blue-500" to={"/sign-in"}>
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

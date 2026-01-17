import { Button } from "@/components/ui/button";
import {
  FaFacebook,
  FaInstagram,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa6";
import { Link } from "react-router";

function StackedCircularFooter() {
  return (
    <footer className="bg-gray-100 mt-[15rem] py-10 relative bottom-0 left-0 w-full">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <Link to="/cart" className="hover:text-primary">
              Cart
            </Link>
            <Link to="/profile/account" className="hover:text-primary">
              Account
            </Link>
            <Link to="/profile/orders" className="hover:text-primary">
              Orders
            </Link>
          </nav>
          <div className="mb-8 flex space-x-4">
            <Button variant="outline" size="icon" className="rounded-full">
              <FaFacebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <FaTwitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <FaInstagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button variant="outline" size="icon" className="rounded-full">
              <FaLinkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © 2025 ByteBazaar. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

export { StackedCircularFooter };

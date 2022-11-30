import { Footer } from "flowbite-react/lib/cjs/index.js";

export const FooterX = () => {
  return (
    <div className="border-2 rounded-lg mb-2 mt-5">
      <Footer container={true}>
        <Footer.Copyright href="#" by=" Social Hub Manager" year={2022} />
        <Footer.LinkGroup className="mt-5 flex-wrap items-center text-sm sm:mt-0">
          <Footer.Link href="#">About</Footer.Link>
          <Footer.Link href="#">Privacy Policy</Footer.Link>
          <Footer.Link href="#">Licensing</Footer.Link>
          <Footer.Link href="#">Contact</Footer.Link>
        </Footer.LinkGroup>
      </Footer>
    </div>
  );
};
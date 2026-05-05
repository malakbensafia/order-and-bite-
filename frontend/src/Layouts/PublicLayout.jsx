import Navbar from "../components/Navbar/Navbar";
import FooterSection from "../components/FooterSection/FooterSection";

const PublicLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      
      <div className="public-content">
        {children}
      </div>

      <FooterSection />
    </>
  );
};

export default PublicLayout;
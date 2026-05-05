import Navbar from "../components/Navbar/Navbar";
import FooterSection from "../components/FooterSection/FooterSection";

const PublicLayout = ({ children, setShowLogin, setRole, setRoleFixed, setAuthMode }) => {
  return (
    <>
      <Navbar
        setShowLogin={setShowLogin}
        setRole={setRole}
        setRoleFixed={setRoleFixed}
        setAuthMode={setAuthMode}
      />
      
      <div className="public-content">
        {children}
      </div>

      <FooterSection />
    </>
  );
};

export default PublicLayout;
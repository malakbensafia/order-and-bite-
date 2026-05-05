import ClientNavbar from "../components/ClientNavbar/ClientNavbar";
import FooterSection from "../components/FooterSection/FooterSection";
import './ClientLayout.css'

const ClientLayout = ({ children, transparent, hideCart }) => {
    return (
        <>
            
            <ClientNavbar hideCart={hideCart} transparent={transparent} />

            <div className="client-content">
                {children}
            </div>

            <FooterSection />
        </>
    );
};

export default ClientLayout;
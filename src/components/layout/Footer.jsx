import { Link } from "react-router-dom";

function Footer() {
    return (
        <footer className="footer footer-center p-10 bg-base-200 text-base-content rounded">
            <nav className="grid grid-flow-col gap-4">
                <Link to="/" className="link link-hover">Home</Link>
                <Link to="/products" className="link link-hover">All Flowers</Link>
                <Link to="/about" className="link link-hover">About</Link>
                <Link to="/contact" className="link link-hover">Contact</Link>
            </nav>
            <nav>
                <div className="grid grid-flow-col gap-4">
                    <a href="#" className="link link-hover">Facebook</a>
                    <a href="#" className="link link-hover">Instagram</a>
                    <a href="#" className="link link-hover">Twitter</a>
                </div>
            </nav>
            <aside>
                <p>Copyright @ 2025 - LazaHoa - FlowerShop</p>
            </aside>
        </footer>
    );
}

export default Footer;
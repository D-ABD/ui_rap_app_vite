import { Link, useNavigate } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';
import { useEffect, useState } from 'react';
import {
  FaHouseUser, FaTachometerAlt, FaCalendarAlt, FaSearch, FaFileAlt,
  FaClipboardList, FaUserCheck, FaCog, FaUser, FaSignOutAlt, FaSignInAlt,
  FaChevronDown, FaBars, FaTimes
} from 'react-icons/fa';
import { useAuth } from '../hooks/useAuth';
import logo from '../assets/logo.png';

// Animations
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

// Styled Components
const Navbar = styled.nav`
  background: linear-gradient(135deg, rgba(13,110,253,0.95) 0%, rgba(20,86,204,0.95) 100%);
  padding: 1rem 2rem;
  position: sticky;
  top: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255,255,255,0.1);

  &.scrolled {
    padding: 0.5rem 2rem;
    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  }
`;

const Logo = styled(Link)`
  display: flex;
  align-items: center;
  color: white;
  text-decoration: none;
  gap: 10px;
  font-weight: bold;
  font-size: 1.2rem;
  transition: transform 0.2s ease;

  &:hover { transform: scale(1.02); }

  img { height: 40px; transition: all 0.3s ease; }

  @media (max-width: 768px) {
    font-size: 1rem;
    img { height: 32px; }
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  display: none;
  cursor: pointer;
  z-index: 1001;
  transition: transform 0.3s ease;

  &:hover { transform: rotate(90deg); }

  @media (max-width: 768px) { display: block; }
`;

const Nav = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen',
})<{ $isOpen: boolean }>`
  display: flex;
  gap: 1.5rem;
  list-style: none;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    flex-direction: column;
    position: fixed;
    top: 0;
    right: 0;
    width: 70%;
    height: 100vh;
    padding: 5rem 2rem;
    background: linear-gradient(135deg, rgba(13,110,253,0.98) 0%, rgba(20,86,204,0.98) 100%);
    box-shadow: -5px 0 15px rgba(0,0,0,0.1);
    transform: ${({ $isOpen }) => ($isOpen ? 'translateX(0)' : 'translateX(100%)')};
    transition: transform 0.3s ease;
    z-index: 1000;
    gap: 1.5rem;
    animation: ${slideIn} 0.3s ease-out;
  }
`;

const NavItem = styled.li`
  position: relative;

  a {
    color: white;
    font-weight: 500;
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 0.5rem 0;
    transition: color 0.2s ease;

    &:hover { color: #fff; }
    &:focus { outline: 2px solid rgba(255,255,255,0.5); border-radius: 4px; }

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background-color: rgba(255,255,255,0.8);
      transition: width 0.3s ease;
    }

    &:hover::after { width: 100%; }
  }

  @media (max-width: 768px) {
    width: 100%;
    border-bottom: 1px solid rgba(255,255,255,0.1);

    a { padding: 0.8rem 0; }
  }
`;

interface SubMenuProps {
  $isOpen: boolean;
}

const SubMenu = styled.ul.withConfig({
  shouldForwardProp: (prop) => prop !== '$isOpen',
})<SubMenuProps>`
  position: absolute;
  top: 100%;
  left: 0;
  background: linear-gradient(135deg, rgba(13, 110, 253, 0.98) 0%, rgba(20, 86, 204, 0.98) 100%);
  border-radius: 8px;
  display: none; /* Masqué par défaut */
  padding: 0.5rem 0;
  list-style: none;
  min-width: 220px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  animation: ${fadeIn} 0.3s ease-out;
  overflow: hidden;
  z-index: 1000;

  li {
    transition: all 0.2s ease;

    &:hover {
      background-color: rgba(255, 255, 255, 0.05);
    }

    a {
      padding: 0.75rem 1.5rem;
      display: flex;
      align-items: center;
      gap: 8px;

      &::after {
        display: none;
      }
    }
  }

  @media (min-width: 769px) {
    /* En desktop : ouvrir quand le parent est hover */
    ${NavItem}:hover & {
      display: block;
    }
  }

  @media (max-width: 768px) {
    position: static;
    width: 100%;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.05);
    margin-top: 0.5rem;
    display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  }
`;

const UserBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255,255,255,0.1);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  transition: background 0.2s ease;

  &:hover { background: rgba(255,255,255,0.2); }

  @media (max-width: 768px) {
    margin-top: auto;
    width: 100%;
    justify-content: center;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1.5rem;
  right: 1.5rem;
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1001;

  &:hover { transform: rotate(90deg); }
`;

const Header = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmenuClick = (e: React.MouseEvent, menu: string) => {
    e.preventDefault();
    setOpenSubmenu(openSubmenu === menu ? null : menu);
  };

  const closeMobileMenu = () => setIsOpen(false);

  return (
    <Navbar className={scrolled ? 'scrolled' : ''}>
      <Logo to="/">
        <img src={logo} alt="Logo" />
        Rap App
      </Logo>

      <ToggleButton onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </ToggleButton>

      <Nav $isOpen={isOpen}>
        {isOpen && <CloseButton onClick={closeMobileMenu}><FaTimes /></CloseButton>}

        <NavItem><Link to="/WelcomeHomePage" onClick={closeMobileMenu}><FaHouseUser /> Accueil</Link></NavItem>
        <NavItem><Link to="/dashboard" onClick={closeMobileMenu}><FaTachometerAlt /> Dashboard</Link></NavItem>
        <NavItem><Link to="/evenements" onClick={closeMobileMenu}><FaCalendarAlt /> Événements</Link></NavItem>

        <NavItem>
          <a href="#" onClick={(e) => handleSubmenuClick(e, 'crm')}><FaSearch /> CRM <FaChevronDown size={12} /></a>
          <SubMenu $isOpen={openSubmenu === 'crm'}>
            <li><Link to="/prospection" onClick={closeMobileMenu}>Prospections</Link></li>
            <li><Link to="/partenaires" onClick={closeMobileMenu}>Partenaires</Link></li>
          </SubMenu>
        </NavItem>

        <NavItem>
          <a href="#" onClick={(e) => handleSubmenuClick(e, 'revue')}><FaFileAlt /> Revue d'offres <FaChevronDown size={12} /></a>
          <SubMenu $isOpen={openSubmenu === 'revue'}>
            <li><Link to="/formations" onClick={closeMobileMenu}>Formations</Link></li>
            <li><Link to="/commentaires" onClick={closeMobileMenu}>Commentaires</Link></li>
            <li><Link to="/documents" onClick={closeMobileMenu}>Documents</Link></li>
          </SubMenu>
        </NavItem>

        <NavItem>
          <a href="#" onClick={(e) => handleSubmenuClick(e, 'prepa')}><FaClipboardList /> Prépa Comp <FaChevronDown size={12} /></a>
          <SubMenu $isOpen={openSubmenu === 'prepa'}>
            <li><Link to="/prepacomp" onClick={closeMobileMenu}>Objectifs Prépa</Link></li>
            <li><Link to="/semaines" onClick={closeMobileMenu}>Suivi hebdo</Link></li>
            <li><Link to="/prepa-globaux" onClick={closeMobileMenu}>Bilans globaux</Link></li>
          </SubMenu>
        </NavItem>

        <NavItem>
          <a href="#" onClick={(e) => handleSubmenuClick(e, 'vae')}><FaUserCheck /> VAE / Jury <FaChevronDown size={12} /></a>
          <SubMenu $isOpen={openSubmenu === 'vae'}>
            <li><Link to="/vae" onClick={closeMobileMenu}>VAE</Link></li>
            <li><Link to="/suivis-jury" onClick={closeMobileMenu}>Suivis jury</Link></li>
          </SubMenu>
        </NavItem>

        <NavItem><Link to="/parametres" onClick={closeMobileMenu}><FaCog /> Paramètres</Link></NavItem>

        {isAuthenticated ? (
          <>
            <NavItem><UserBadge><FaUser /> {user?.username || user?.email}</UserBadge></NavItem>
            <NavItem><a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); closeMobileMenu(); }}><FaSignOutAlt /> Déconnexion</a></NavItem>
          </>
        ) : (
          <NavItem><Link to="/login" onClick={closeMobileMenu}><FaSignInAlt /> Connexion</Link></NavItem>
        )}
      </Nav>
    </Navbar>
  );
};

export default Header;

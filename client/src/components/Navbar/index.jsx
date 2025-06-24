import { Icon } from '../Icon';
import { ModalRoutes } from '../modalRoutes';
import { Text } from '../Text'
import './navbar.css';

export const Navbar = ({ onSelect, routes, activeIndex, user, onOpenMenu }) => {
    
    return (
        <nav>
            {user?.admin && routes.filter(r => r.visibleTo.includes('admin')).map((r) => (
                <div 
                    className={`navbar-content-container ${activeIndex === r.name ? 'active' : ''}`}
                    onClick={() => {
                        onSelect(r.name);
                    }}
                    key={r.name}
                >
                    <div className="navbar-content">   
                        <Icon name={r.icon} size={18}/>
                        <div className="navbar-text-wrapper">
                            <Text variant={'subtitle'}>{r.label}</Text>
                        </div>
                    </div>
                </div>
            ))}
            {routes.filter(r => r.visibleTo.includes('user') && r.name !== 'userProfile').map((r) => (
                <div 
                    className={`navbar-content-container ${activeIndex === r.name ? 'active' : ''}`}
                    onClick={() => {
                        onSelect(r.name);
                    }}
                    key={r.name}
                >
                    <div className="navbar-content">   
                        <Icon name={r.icon} size={18}/>
                        <div className="navbar-text-wrapper">
                            <Text variant={'subtitle'}>{r.label}</Text>
                        </div>
                    </div>
                </div>
            ))}
            <div className={'navbar-content-container-menu'}>
                <ModalRoutes isInNavbar={true} routes={routes} user={user} onClick={() => {onOpenMenu()}}/>
            </div>
        </nav>
    );
};
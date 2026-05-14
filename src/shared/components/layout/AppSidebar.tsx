'use client';
import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music, ShoppingCart } from 'lucide-react';
import { useSidebar } from '@/shared/context/SidebarContext';
import Logo from './Logo';
import {
  BoxCubeIcon,
  ChevronDownIcon,
  DocsIcon,
  DollarLineIcon,
  GridIcon,
  GroupIcon,
  HorizontaLDots,
  PaperPlaneIcon,
} from '@/shared/icons';

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: 'Dashboard',
    path: '/',
  },
  {
    icon: <BoxCubeIcon />,
    name: 'Estoque',
    path: '/inventory',
  },
  {
    icon: <DollarLineIcon />,
    name: 'Vendas',
    path: '/sales',
  },
  {
    icon: <GroupIcon />,
    name: 'Clientes',
    path: '/customers',
  },
  {
    icon: <Music className="h-5 w-5" strokeWidth={2} />,
    name: 'Artistas',
    path: '/artists',
  },
  {
    icon: <ShoppingCart className="h-5 w-5" strokeWidth={2} />,
    name: 'Compras',
    path: '/purchases',
  },
  {
    icon: <DocsIcon />,
    name: 'Relatório Financeiro',
    path: '/revenue',
  },
  {
    icon: <PaperPlaneIcon />,
    name: 'Entregas',
    path: '/deliveries',
    subItems: [
      { name: 'Todas as Entregas', path: '/deliveries' },
      { name: 'Pendentes', path: '/deliveries/pending' },
      { name: 'Concluídas', path: '/deliveries/completed' },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<{
    type: 'main';
    index: number;
  } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Keep the submenu for the current route open when pathname changes.
  useEffect(() => {
    const activeIndex = navItems.findIndex((item) =>
      item.subItems?.some((subItem) => subItem.path === pathname)
    );
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpenSubmenu(activeIndex >= 0 ? { type: 'main', index: activeIndex } : null);
  }, [pathname]);

  // Update submenu height when it changes
  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prevHeights) => ({
          ...prevHeights,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  const isActive = (path: string) => path === pathname;

  const isSubmenuActive = (item: NavItem) =>
    item.subItems?.some((subItem) => isActive(subItem.path)) ?? false;

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prevOpenSubmenu) => {
      if (prevOpenSubmenu && prevOpenSubmenu.index === index) {
        return null;
      }
      return { type: 'main', index };
    });
  };

  const renderMenuItems = (items: NavItem[], menuType: 'main' | 'others') => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            nav.path ? (
              <Link
                href={nav.path}
                onClick={() => setOpenSubmenu({ type: 'main', index })}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-active'
                    : isSubmenuActive(nav)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                } cursor-pointer ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? 'menu-item-icon-active'
                      : isSubmenuActive(nav)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? 'text-brand-500 rotate-180'
                        : ''
                    }`}
                  />
                )}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => handleSubmenuToggle(index)}
                className={`menu-item group ${
                  openSubmenu?.type === menuType && openSubmenu?.index === index
                    ? 'menu-item-active'
                    : isSubmenuActive(nav)
                      ? 'menu-item-active'
                      : 'menu-item-inactive'
                } cursor-pointer ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'lg:justify-start'
                }`}
              >
                <span
                  className={` ${
                    openSubmenu?.type === menuType && openSubmenu?.index === index
                      ? 'menu-item-icon-active'
                      : isSubmenuActive(nav)
                        ? 'menu-item-icon-active'
                        : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
                {(isExpanded || isHovered || isMobileOpen) && (
                  <ChevronDownIcon
                    className={`ml-auto h-5 w-5 transition-transform duration-200 ${
                      openSubmenu?.type === menuType && openSubmenu?.index === index
                        ? 'text-brand-500 rotate-180'
                        : ''
                    }`}
                  />
                )}
              </button>
            )
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? 'menu-item-active' : 'menu-item-inactive'
                }`}
              >
                <span
                  className={`${
                    isActive(nav.path) ? 'menu-item-icon-active' : 'menu-item-icon-inactive'
                  }`}
                >
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className={`menu-item-text`}>{nav.name}</span>
                )}
              </Link>
            )
          )}
          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : '0px',
              }}
            >
              <ul className="mt-2 ml-9 space-y-1">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? 'menu-dropdown-item-active'
                          : 'menu-dropdown-item-inactive'
                      }`}
                    >
                      {subItem.name}
                      <span className="ml-auto flex items-center gap-1">
                        {subItem.new && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            new
                          </span>
                        )}
                        {subItem.pro && (
                          <span
                            className={`ml-auto ${
                              isActive(subItem.path)
                                ? 'menu-dropdown-badge-active'
                                : 'menu-dropdown-badge-inactive'
                            } menu-dropdown-badge`}
                          >
                            pro
                          </span>
                        )}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside
      className={`fixed top-0 left-0 z-50 mt-16 flex h-screen flex-col border-r border-gray-200 bg-white px-5 text-gray-900 transition-all duration-300 ease-in-out lg:mt-0 dark:border-gray-800 dark:bg-gray-900 ${
        isExpanded || isMobileOpen ? 'w-72.5' : isHovered ? 'w-72.5' : 'w-22.5'
      } ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="border-b border-gray-200 py-4 dark:border-gray-800">
        {(isExpanded || isMobileOpen) && <Logo showText={true} />}
      </div>
      <div className="py-6" />
      <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 flex text-xs leading-5 text-gray-400 uppercase ${
                  !isExpanded && !isHovered ? 'lg:justify-center' : 'justify-start'
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? 'Menu' : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems, 'main')}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;

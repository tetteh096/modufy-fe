export type NavLeafItem = {
  label: string;
  href?: string;
  appHref?: string;
};

export type NavGroupItem = {
  label: string;
  children: NavItem[];
};

export type NavItem = NavLeafItem | NavGroupItem;

export function isNavGroup(item: NavItem): item is NavGroupItem {
  return "children" in item && Array.isArray(item.children);
}

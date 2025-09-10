import { FC } from "react";
import ScrollToTop from "@/components/common/ScrollToTop";
import SimpleMenuHeader from "@/components/menu/SimpleMenu/SimpleMenuHeader";
import SimpleMenuSections from "@/components/menu/SimpleMenu/SimpleMenuSections";
import { PublicMenuData } from "@/lib/repositories/public-menu-repository";

interface Params {
  menu: PublicMenuData;
}

const SimpleMenu: FC<Params> = (props) => {
  return (
    <div className="min-h-screen bg-white text-foreground">
      <div className="max-w-4xl mx-auto px-2 py-6">
        <SimpleMenuHeader logoUrl={props.menu.cafe.logo_url} />
        <SimpleMenuSections categories={props.menu.categories} currency={props.menu.cafe.currency} />
      </div>
      <ScrollToTop />
    </div>
  );
};

export default SimpleMenu;

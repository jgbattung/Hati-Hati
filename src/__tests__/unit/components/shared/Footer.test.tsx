import Footer from "@/components/shared/Footer";
import { footerRoutes } from "@/constants";
import { footerTestIds } from "@/utils/constants";
import { render, screen } from "@testing-library/react"


const renderFooter = () => {
  render(<Footer />);
};

jest.mock('next/navigation', () => ({
  usePathname: () => '/',
}));

describe("Footer tests", () => {
  it("should display the Footer without crashing", () => {
    renderFooter();

    const footer = screen.getByTestId(footerTestIds.footer);
    expect(footer).toBeInTheDocument();
  });

  it('should display the correct icons', () => {
    renderFooter();

    footerRoutes.forEach((route) => {
      const icon = screen.getByTestId(`icon-${route.iconId}`);
      expect(icon).toBeInTheDocument();
    });
  });
});
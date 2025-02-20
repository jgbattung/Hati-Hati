import Footer from "@/components/shared/Footer";
import { footerRoutes } from "@/constants";
import { footerTestIds } from "@/utils/constants";
import { useAuth } from "@clerk/nextjs";
import { render, screen } from "@testing-library/react"


const renderFooter = () => {
  render(<Footer />);
};

jest.mock("@clerk/nextjs", () => ({
  useAuth: jest.fn()
}));

jest.mock('next/navigation', () => ({
  usePathname: () => '/groups',
}));

describe("Footer tests", () => {
  it("should display the Footer without crashing", () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
    });

    renderFooter();

    const footer = screen.getByTestId(footerTestIds.footer);
    expect(footer).toBeInTheDocument();
  });

  it('should display the correct icons', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: true,
    });

    renderFooter();

    footerRoutes.forEach((route) => {
      const icon = screen.getByTestId(`icon-${route.iconId}`);
      expect(icon).toBeInTheDocument();
    });
  });

  it('should not render when user is not signed in', () => {
    (useAuth as jest.Mock).mockReturnValue({
      isSignedIn: false,
    });

    const { container } = render(<Footer />);

    expect(screen.queryByTestId(footerTestIds.footer)).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });
});
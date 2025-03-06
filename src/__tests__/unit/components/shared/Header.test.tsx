import Header from "@/components/shared/Header";
import { headerTestIds } from "@/utils/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

const mockBack = jest.fn();
jest.mock('next/navigation', () => ({
  usePathname: () => '/test-path',
  useRouter: () => ({
    back: mockBack,
  }),
}));

const renderHeader = () => {
  render(<Header />)
}

describe("Header tests", () => {
  it("should display the Header without crashing", () => {
    renderHeader();

    const header = screen.getByTestId(headerTestIds.header);
    expect(header).toBeInTheDocument();
  });

  it("should display the correct icons", () => {
    renderHeader();

    const backButton = screen.getByTestId(headerTestIds.backButton);
    expect(backButton).toBeInTheDocument();

    const settingsButton = screen.getByTestId(headerTestIds.settingsButton);
    expect(settingsButton).toBeInTheDocument()
  });

  it("should call router.back() when back button is clicked", async () => {
    renderHeader();

    const backButton = screen.getByTestId(headerTestIds.backButton);

    await userEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it("should have the correct settings link", () => {
    renderHeader();

    const settingsButton = screen.getByTestId(headerTestIds.settingsButton);

    expect(settingsButton).toHaveAttribute('href', '/test-path/settings');
  });
});

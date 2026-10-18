import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import App from "../src/App";

describe("Rinemi responsive shell", () => {
  it("starts in Persian RTL and presents one obvious primary action", () => {
    const { container } = render(<App />);

    expect(container.querySelector(".app-shell")).toHaveAttribute("dir", "rtl");
    expect(screen.getByRole("heading", { name: "با یک قدم کوچک شروع کن." })).toBeVisible();
    expect(screen.getByRole("button", { name: "شروع مطالعه" })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "ناوبری اصلی" })).toBeVisible();
  });

  it("reveals the answer without removing the readings or rating controls", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "شروع مطالعه" }));
    expect(screen.getByRole("heading", { name: "森" })).toBeVisible();
    fireEvent.click(screen.getByRole("button", { name: "نمایش پاسخ" }));

    expect(screen.getByRole("heading", { name: "جنگل" })).toBeVisible();
    expect(screen.getByText("シン")).toBeVisible();
    expect(screen.getByText("もり")).toBeVisible();
    expect(screen.getByText("森林")).toBeVisible();
    expect(screen.getByRole("button", { name: "دوباره" })).toBeVisible();
    expect(screen.getByRole("button", { name: "آسان" })).toBeVisible();
  });

  it("switches the UI to English LTR without losing the current navigation model", () => {
    const { container } = render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "EN — تغییر زبان به انگلیسی" }));

    expect(container.querySelector(".app-shell")).toHaveAttribute("dir", "ltr");
    expect(screen.getByRole("heading", { name: "Start with one small step." })).toBeVisible();
    expect(screen.getByRole("navigation", { name: "Primary navigation" })).toBeVisible();
  });

  it("offers a theme control with an explicit accessible name", () => {
    render(<App />);

    fireEvent.click(screen.getByRole("button", { name: "فعال‌کردن حالت تیره" }));

    expect(screen.getByRole("button", { name: "فعال‌کردن حالت روشن" })).toBeVisible();
  });
});
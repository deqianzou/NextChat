import styles from "./auth.module.scss";
import { IconButton } from "./button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { Path, PropertyGpt, SAAS_CHAT_URL } from "../constant";
import Locale from "../locales";
import Delete from "../icons/close.svg";
import Arrow from "../icons/arrow.svg";
import Logo from "../icons/logo.svg";
import { useMobileScreen } from "@/app/utils";
import BotIcon from "../icons/bot.svg";
import { Input, PasswordInput } from "./ui-lib";
import LeftIcon from "@/app/icons/left.svg";
import { safeLocalStorage } from "@/app/utils";
import { trackSettingsPageGuideToCPaymentClick } from "../utils/auth-settings-events";
import clsx from "clsx";

const storage = safeLocalStorage();

export function LoginPage() {
  const navigate = useNavigate();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const response = await fetch(
        PropertyGpt.BaseUrl + PropertyGpt.LoginPath,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({
            identifier,
            password,
          }),
        },
      );

      if (!response.ok) {
        const error = await response.json();
        alert("Login failed: " + (error.message || response.statusText));
        return;
      }

      const result = await response.json();
      console.log("Login success:", result);

      navigate(Path.Chat); // Redirect to chat on success
    } catch (err) {
      alert("Network error. Please try again.");
      console.error(err);
    }
  };

  return (
    <div className={styles["auth-page"]}>
      <TopBanner />
      <div className={styles["auth-header"]}>
        <IconButton
          icon={<LeftIcon />}
          text="Back"
          onClick={() => navigate(Path.Home)}
        />
      </div>

      <div className={clsx("no-dark", styles["auth-logo"])}>
        <BotIcon />
      </div>

      <div className={styles["auth-title"]}>Login</div>
      <div className={styles["auth-tips"]}>Please login to continue</div>

      <Input
        style={{ marginTop: "3vh", marginBottom: "3vh" }}
        type="text"
        placeholder="Login with your username/email/phone"
        value={identifier}
        onInput={(e) => setIdentifier(e.currentTarget.value)}
      ></Input>

      <PasswordInput
        style={{ marginTop: "3vh", marginBottom: "3vh" }}
        type="password"
        placeholder="Input your password"
        value={password}
        onChange={(e) => setPassword(e.currentTarget.value)}
      />

      <div className={styles["auth-actions"]}>
        <IconButton text="Login" type="primary" onClick={handleLogin} />
        <Link to={Path.Signup} className={styles["auth-signup-link"]}>
          Signup
        </Link>
      </div>
    </div>
  );
}

function TopBanner() {
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const isMobile = useMobileScreen();
  useEffect(() => {
    // 检查 localStorage 中是否有标记
    const bannerDismissed = storage.getItem("bannerDismissed");
    // 如果标记不存在，存储默认值并显示横幅
    if (!bannerDismissed) {
      storage.setItem("bannerDismissed", "false");
      setIsVisible(true); // 显示横幅
    } else if (bannerDismissed === "true") {
      // 如果标记为 "true"，则隐藏横幅
      setIsVisible(false);
    }
  }, []);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const handleClose = () => {
    setIsVisible(false);
    storage.setItem("bannerDismissed", "true");
  };

  if (!isVisible) {
    return null;
  }
  return (
    <div
      className={styles["top-banner"]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className={clsx(styles["top-banner-inner"], "no-dark")}>
        <Logo className={styles["top-banner-logo"]}></Logo>
        <span>
          {Locale.Auth.TopTips}
          <a
            href={SAAS_CHAT_URL}
            rel="stylesheet"
            onClick={() => {
              trackSettingsPageGuideToCPaymentClick();
            }}
          >
            {Locale.Settings.Access.SaasStart.ChatNow}
            <Arrow style={{ marginLeft: "4px" }} />
          </a>
        </span>
      </div>
      {(isHovered || isMobile) && (
        <Delete className={styles["top-banner-close"]} onClick={handleClose} />
      )}
    </div>
  );
}

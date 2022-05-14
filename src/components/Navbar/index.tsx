/* eslint-disable @next/next/no-html-link-for-pages */
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";

import { NavbarContainer } from "./styles";

import PHLogo from "../../assets/images/pizy.svg";
import PHLemon from "../../assets/pizy/logo.svg";
import Link from "next/link";
import {
  Bell,
  Gauge,
  Gear,
  PencilSimple,
  Question,
  SignOut,
  User,
} from "phosphor-react";
import { firebase, auth } from "~/services/firebase";
import AuthContext from "~/contexts/AuthContext";
import { useRouter } from "next/router";

interface NavbarProps {
  handleLoggedChange: (logged: boolean) => void;
}

export default function Navbar({ handleLoggedChange }: NavbarProps) {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  function logOutFirebase() {
    firebase
      .auth()
      .signOut()
      .then(function () {
        confirm("Deslogado com sucesso");
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  return (
    <>
      <NavbarContainer>
        <div className="header">
          <a id="logo" href="/">
            <div>
              <Image
                src={PHLemon}
                alt="PIZY House Logo"
                width={64}
                height={46}
              />
            </div>
            <div>
              <Image
                src={PHLogo}
                alt="PIZY House Logo"
                width={80}
                height={64}
              />
            </div>
          </a>
          <ul>
            <li>
              <Link href="/">Início</Link>
            </li>
            <li>
              <Link href="/topday">Melhores do dia</Link>
            </li>
            <li>
              <Link href="/nfts/">NFTs</Link>
            </li>
            <li className="options">
              <a>
                Sobre
                <i />
              </a>
              <ul className="dropdown">
                <Link href="/about-us">Sobre a PIZY</Link>
                <Link href="/about-market">Sobre o Mercado</Link>
              </ul>
            </li>
          </ul>
          <div className="account-actions">
            <>
              {!user ? (
                <>
                  <button
                    onClick={() => {
                      window.location.href = "/signin";
                    }}
                    className="signin"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => {
                      window.location.href = "/signup";
                    }}
                    className="signup"
                  >
                    Criar Conta
                  </button>
                </>
              ) : (
                <>
                  <li>
                    <Link href="/dashboard/help" passHref>
                      <Question />
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/configurations" passHref>
                      <Gear />
                    </Link>
                  </li>
                  <li>
                    <Link href="/dashboard/notifications" passHref>
                      <Bell />
                    </Link>
                  </li>
                  <li id="user">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} />
                    ) : (
                      <User />
                    )}
                    <ul className="dropdown">
                      <li>
                        <Gauge weight="bold" />
                        <Link href="/dashboard">Dashboard</Link>
                      </li>
                      <li>
                        <PencilSimple weight="bold" />
                        <Link href="/dashboard/profile">Perfil</Link>
                      </li>
                      <li>
                        <SignOut weight="bold" />
                        <button
                          onClick={() => {
                            logOutFirebase();
                          }}
                        >
                          Sair
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              )}
            </>
          </div>
        </div>
      </NavbarContainer>
    </>
  );
}
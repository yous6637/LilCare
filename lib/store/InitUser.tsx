"use client";
import { User } from "@supabase/supabase-js";
import React, { useEffect, useRef } from "react";
import { supabaseBrowser } from "../supabase/browser";
import { useSessionUser } from "../hooks";

export default function InitUser() {
	const initState = useRef(false);

	useEffect(() => {
		// if (!initState.current) {
		// 	useUser.setState({ user });
		// }

		supabaseBrowser().auth.getUser().then((session) => {
			useSessionUser.setState({currentUser : session.data?.user || undefined})
		})
		initState.current = true;
		// eslint-disable-next-line
	}, []);

	return <></>;
}

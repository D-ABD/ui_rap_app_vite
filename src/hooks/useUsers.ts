import { useEffect, useState } from "react";
import api from "../api/axios";
import { CustomUser, RoleChoice, SimpleUser, CustomUserRole } from "../types/User";

export function useUsers() {
  const [users, setUsers] = useState<CustomUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/").then((res) => {
      setUsers(res.data?.results || []);
    }).finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

export function useMe() {
  const [me, setMe] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/me/").then((res) => {
      setMe(res.data?.data || null);
    }).finally(() => setLoading(false));
  }, []);

  return { me, loading };
}

export function useRoles() {
  const [roles, setRoles] = useState<RoleChoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/roles/").then((res) => {
      const data = res.data?.data;
      if (data) {
        const parsed: RoleChoice[] = Object.entries(data).map(
          ([value, label]) => ({
            value: value as CustomUserRole,
            label: label as string,
          })
        );
        setRoles(parsed);
      }
    }).finally(() => setLoading(false));
  }, []);

  return { roles, loading };
}

export function useSimpleUserList() {
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users/liste-simple/").then((res) => {
      setUsers(res.data?.data || []);
    }).finally(() => setLoading(false));
  }, []);

  return { users, loading };
}

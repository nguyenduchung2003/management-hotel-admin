import { type RouteConfig, layout, index, route } from "@react-router/dev/routes";

export default [
  layout("components/AdminLayout.tsx", [
    index("routes/dashboard.tsx"),
    route("properties", "routes/properties.tsx"),
    route("rooms", "routes/rooms.tsx"),
    route("bookings", "routes/bookings.tsx"),
    route("users", "routes/users.tsx"),
    route("amenities", "routes/amenities.tsx"),
    route("reviews", "routes/reviews.tsx"),
  ]),
] satisfies RouteConfig;

import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import CreateMemorial from "./pages/CreateMemorial";
import About from "./pages/About";
import Dashboard from "./pages/Dashboard";
import EditMemorial from "./pages/EditMemorial";
import Feed from "./pages/Feed";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Home from "./pages/Home";
import MemorialProfile from "./pages/MemorialProfile";
import MyMemorials from "./pages/MyMemorials";
import Search from "./pages/Search";
import Login from "./pages/Login";
import Register from "./pages/Register";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/create" component={CreateMemorial} />      <Route path={"/memorial/:id"} component={MemorialProfile} />
      <Route path={"/memorial/:id/edit"} component={EditMemorial} />      <Route path="/my-memorials" component={MyMemorials} />
      <Route path="/search" component={Search} />
      <Route path="/feed" component={Feed} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/about" component={About} />
      <Route path="/privacy" component={Privacy} />
      <Route path="/terms" component={Terms} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

import { Authenticator } from '@aws-amplify/ui-react';
import '@aws-amplify/ui-react/styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import FileUpload from './FileUpload';
export default function App() {
  return (
    <Authenticator>
      {({ signOut }) => (
        <div className="bg-light min-vh-100 d-flex flex-column">
          {/* Header */}
          <nav className="navbar navbar-dark bg-primary shadow-sm">
            <div className="container">
              <span className="navbar-brand mb-0 h1">
                Secure File Upload Portal
              </span>
              <button
                className="btn btn-outline-light"
                onClick={signOut}
              >
                Sign out
              </button>
            </div>
          </nav>
 
          {/* Main Content */}
          <main className="flex-grow-1 py-4">
            <FileUpload />
          </main>
 
          {/* Footer */}
          <footer className="bg-white border-top py-2 text-center text-muted">
            © {new Date().getFullYear()} Secure Upload System
          </footer>
        </div>
      )}
    </Authenticator>
  );
}
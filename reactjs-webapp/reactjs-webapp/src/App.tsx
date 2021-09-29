import * as React from 'react';

import './App.css';
import { FeedbackForm , IFields, isEmail, maxLength, required, } from "./FeedbackForm";
import { Field } from "./Field";

import ctehpic from './Images/cteh.png';
import jamiepic from './Images/jamie.png';
import logo from './Images/logo.png';

const fields: IFields = {
    description: {
        editor: "multilinetextbox",
        id: "description",
        label: "Feedback",
        length: 10,
        validation: { rule: maxLength, args: 500 }
    },
    email: {
        id: "email",
        label: "Email",
        validation: { rule: isEmail }
    },
    firstName: {
        id: "firstName",
        label: "Name",
        validation: { rule: required }
    }
};

class App extends React.Component {


  public render() {
      return (
          <div className="App">
              <section className="intro" id="home">
                  <header className="center">
                      <img src={logo} alt="logo" />
                      <nav><a href="#home">Home</a> <a href="#about-us">About Us</a> <a href="#contact-us">Contact Us</a></nav>
                  </header>
                  <article className="center">
                      <p className="quote"><q>The purpose of learning is growth, and our minds, unlike our bodies, can continue growing as we continue to live</q></p>
                      <p className="author">Mortimer Adler</p>
                  </article>
              </section>
              <section className="aboutus" id="about-us">
                  <header className="center">
                      <img src={logo} alt="logo" />
                      <nav>
                          <a href="#home">Home</a>
                          <a href="#about-us">About Us</a>
                          <a href="#contact-us">Contact Us</a></nav>
                  </header>
                  <div className="banner" />
                  <div className="profiles center">
                      <div className="profile">
                          <div className="profilepic">
                              <img src={jamiepic} alt="Jamie Mack" />
                          </div>
                          <div className="profiledata">
                              <h3>Jamie Mack</h3>
                              <div className="profiletitle">Application Development - Team Leader</div>
                              <div className="profilebio">
                                <p>Jamie is a passionate leader of a large development team with one of the largest companies in Australia.</p>

                                <p>In the past he has worked as a Software Developer and Solution Architect.</p>

                                <p>In his day job he now spends the majority of his time finding new and innovative ways to deploy quality software to production as fast as possible.  Most of his time is spent coaching developers and building tooling to streamline the "inner dev loop".</p>
                              </div>
                          </div>
                      </div>
                      <div className="profile">
                          <div className="profilepic">
                              <img src={ctehpic} alt="Christian Teh" />
                          </div>
                          <div className="profiledata">
                              <h3>Christian Teh</h3>
                              <div className="profiletitle">Lead Developer</div>
                              <div className="profilebio">
                                  <p>Christian is a Lead Developer focused on building enterprise applications that are used by hundreds of thousands of users.</p>

                                  <p>Christian has worked across many industries, from finance to education.  He has experience in both building and consulting teams on how to build solutions.</p>

                                  <p>His speciality is delivering rich user experiences that are fast, functional and beautiful.  He is a JavaScript and caching wizard.  If its Angular or Aurelia, Redis or Memcached; Christian has built an application with it.</p>
                              </div>
                          </div>
                      </div>
                  </div>
              </section>
              <section className="contactus" id="contact-us">
                  <header className="center">
                      <img src={logo} alt="logo" />
                      <nav>
                          <a href="#home">Home</a>
                          <a href="#about-us">About Us</a>
                          <a href="#contact-us">Contact Us</a></nav>
                  </header>
                  <div className="contactuscontainer">
                      <div className="center">
                          <FeedbackForm
                              fields={fields}
                              action="#{apiurl}#"
                              render={ this.renderForm }
                          />
                      </div>
                  </div>
              </section>
              <footer>
                  <div className="center">
                      <p>Copyright &copy; 2018 Xassee</p>
                  </div>
              </footer>
          </div>
    );
    }



    private renderForm = () => {
        return (
            <React.Fragment>
                <Field {...fields.firstName} />
                <Field {...fields.email} />
                <Field {...fields.description} />
            </React.Fragment>
        );
    }
}

export default App;

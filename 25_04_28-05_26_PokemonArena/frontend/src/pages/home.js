import React from 'react';
import '../styles/home.css';

function Home() {

    const homeContentStyles = {
        backgroundColor: 'rgba(255, 255, 255, 0.75)',
        color: '#333333',
        border: '1px solid #dddddd',
        backdropFilter: 'blur(3px)',
        position: 'relative',
        paddingBottom: '40px' // Deutlich reduziert, um unnötigen Leerraum unten zu vermeiden
    };

    return (
        <div
            className='content-wrap styled-box home-container-styles'
            style={homeContentStyles}
        >
            <div className='content'>
                <header>
                    <h1 className='headline'>Willkommen bei Pokémon Arena!</h1>
                </header>
                <section>
                    <p>
                        Wir heißen dich herzlich willkommen auf Pokémon Arena, deinem digitalen Forschungslabor rund um Pokémon! Hier findest du nicht nur einen vollständigen Pokédex, sondern auch die Möglichkeit, dein eigenes Team zusammenzustellen und es in strategischen Kämpfen gegen einen Bot-Gegner auf die Probe zu stellen.
                    </p>
                    <h3>Was erwartet dich in unserem Labor?</h3>
                    <ul className='list'>
                        <li className='pokeball-list-item'>Ein übersichtlicher Pokédex mit allen bekannten Pokémon</li>
                        <li className='pokeball-list-item'>Ein Team-Builder, mit dem du dein ideales Team erforschen kannst</li>
                        <li className='pokeball-list-item'>Kämpfe gegen unseren Bot, um deine Strategien zu testen</li>
                    </ul>
                    <p>
                        Und natürlich jede Menge Wissen, das es zu entdecken gilt!<br />
                        Ob du gerade erst deine Reise beginnst oder ein erfahrener Trainer bist - bei uns bist du genau richtig.<br />
                        Bereit für dein erstes Forschungsexperiment?<br />
                        Dann schnapp dir dein Team und tritt in den Kampf ein!
                    </p>
                </section>
                <section>
                    <p>
                        Als Pokémon-Professoren haben wir es uns zur Aufgabe gemacht, das Wissen über Pokémon zu sammeln, zu ordnen - und weiterzugeben.<br />
                        Doch Theorie allein reicht nicht: Ein gutes Team muss sich auch im Kampf beweisen!
                    </p>
                    <p>
                        Deshalb haben wir PokéBattle erschaffen - eine digitale Forschungsplattform, auf der Trainerinnen und Trainer Pokémon entdecken, Teams entwickeln und ihr Können testen können.<br />
                        Egal ob du Pokémon nur aus Kindheitstagen kennst oder tief in Typen, Werte und Strategien eintauchst - hier ist Platz für alle, die Pokémon lieben.
                    </p>
                </section>
            </div>
            <div className="professor-images-container">
                <img src={`${process.env.PUBLIC_URL}/images/Prof_Alex.png`} alt="Professor Alex" className="professor-image" />
                <img src={`${process.env.PUBLIC_URL}/images/Prof_Josh.png`} alt="Professor Josh" className="professor-image" />
                <img src={`${process.env.PUBLIC_URL}/images/Prof_Loki.png`} alt="Professor Loki" className="professor-image" />
            </div>
        </div>
    );
}

export default Home;
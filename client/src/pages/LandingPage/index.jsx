import { BlurText } from '../../components/BlurText';
import { Button } from '../../components/buttons';
import { Text } from '../../components/Text';
import { useContext } from "react";
import { ThemeContext } from 'styled-components';
import { Spacer } from '../../components/Spacer';
import { useNavigate } from 'react-router-dom';
import "./Landing.css"
import { FadeIn } from '../../components/FadeIn';

export const Landing = () => {
    const theme = useContext(ThemeContext);
    const navigate = useNavigate(); 

    const goToExam = () => {
        navigate('/search');
    };

    return (
        <div className="landing-wrapper">
            <FadeIn>
                <BlurText
                    text="Esame full stack web developer"
                    className="BlurText"
                />
            </FadeIn>
            <FadeIn>
                <BlurText
                    text="presented by Grasso Ludovico"
                    className="BlurName"
                    initialDelay={500}
                />
            </FadeIn>
            <Spacer height={theme.sizes.gap6}/>
            <FadeIn>
                <div className='animated-landing-container'>
                    <Text variant={'body'}>My name is Ludovico Grasso and I am a full stack web development student.
                        In this site you will find my exam, a project that reflects my learning journey and
                        my passion for creating innovative web applications.</Text>
                    <div className='animated-landing-button-container'>
                        <Button icon={'end'} iconName={'github'} size={'regular'} variant={'accent'} onClick={goToExam}>Go to folder</Button>
                        <Button icon={'end'} iconName={'chevron-right'} size={'regular'} variant={'primary'} onClick={goToExam}>Go to exam</Button>
                    </div>
                </div>
            </FadeIn>
        </div>
    )
}

export default Landing;
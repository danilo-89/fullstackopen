import React from 'react';
import Header from './Header';
import Content from './Content';
import Total from './Total';

const Course = ({ course }) => {
    return (
        <>
            <Header name={course.name} />
            <Content course={course} />
            <Total course={course} />
        </>
    );
}

export default Course
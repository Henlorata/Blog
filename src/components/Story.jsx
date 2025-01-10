import {useEffect, useState} from 'react';
import Editor from 'react-simple-wysiwyg';
import {EditorProvider} from 'react-simple-wysiwyg';
import './Story.css'

export const Story = ({story, setStory, uploaded}) => {
    const [html, setHtml] = useState('Write something nice!');

	useEffect(() => {
		setHtml(story)
	}, [story]);

    return (<EditorProvider>
            <Editor value={html} onChange={(e) => setHtml(e.target.value)}
                    onBlur={() => setStory(html)}
            />
        </EditorProvider>

    );
}
import React from 'react';
import { Grid, Segment } from 'semantic-ui-react';

function Footer() {
    return (
        <div style={{ marginTop: 'auto' }}>
        <Grid>
            <Grid.Row>
            <Grid.Column>
                <Segment inverted vertical>
                <p>&copy; Counter Strike Strategy Builder</p>
                </Segment>
            </Grid.Column>
            </Grid.Row>
        </Grid>
        </div>
    );
}

export default Footer;

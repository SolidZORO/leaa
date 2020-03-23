import { Test, TestingModule } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '@leaa/api/src/app.module';

describe('AppController (e2e)', () => {
  let app: any;
  let server: any;

  beforeEach(async () => {
    jest.setTimeout(10000);

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    server = app.getHttpServer();

    await app.init();
  });

  it('/ (GET)', (done) => {
    return request(server).get('/').expect(200).expect('<code>-- EOF --</code>').end(done);
  });

  it('/attachments (GET) Unauthorized', (done) => {
    return request(server)
      .get('/attachments')
      .expect(401)
      .expect({
        statusCode: 401,
        error: 'Unauthorized',
      })
      .end(done);
  });

  it('/attachments (GET) Authorized', (done) => {
    // eslint-disable-next-line max-len
    const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NSwiaWF0IjoxNTY0NjUwMDk3LCJleHAiOjE1ODAyMDIwOTd9.6rrQ6qkFWIujvEYvQDye_zxo7Ox4cnDl6Hbns3eyYQI'; // prettier-ignore

    return request(server)
      .get('/attachments')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect('<code>-- NOT FOUND ATTACHMENT --</code>')
      .end(done);
  });

  afterAll(async () => {
    return app.close();
  });
});

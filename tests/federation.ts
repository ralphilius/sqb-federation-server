import { loadEnvConfig } from '@next/env'
import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import { done } from 'nprogress';
import { initSupabase } from '../lib/supabase';

const baseUrl = process.env.CODESPACES_PREVIEW || 'http://localhost:3000'
chai.use(chaiHttp);
chai.should();

describe("/federation api works", function () {
  this.timeout(30000);
  loadEnvConfig(process.cwd())
  let requester = chai.request(`${baseUrl}/api`).keepOpen();
  let userId = '';
  before(async () => {
    const supabase = initSupabase(true);
    return new Promise(async function (resolve) {
      await supabase.auth.api.signUpWithEmail("test@example.com", "test!23");
      const { user } = await supabase.auth.signIn({
        email: "test@example.com",
        password: "test!23"
      })
      if (!user) throw "Error setting up test account";
      userId = user?.id;

      await supabase.from("addresses").update({
        username: "test",
        address: "GABCXYZ"
      });
      resolve();
    });
  })

  after(() => {
    requester.close();
  })

  it('should return account id for a username', (done) => {
    requester
      .get('/federation')
      .query({
        q: 'test*ralphilius.com',
        type: 'name'
      })
      .send()
      .end((err, res) => {
        expect(err).to.be.null;
        expect(res).to.have.status(200);
        expect(res).to.be.json
        expect(res.body).to.have.property('stellar_address').to.equal('test*ralphilius.com')
        expect(res.body).to.have.property('account_id').to.equal('GABCXYZ')
        done();
      });
  })
})
using E_EstateV2_API.IRepository;
using E_EstateV2_API.Models;
using Microsoft.AspNetCore.Mvc;

namespace E_EstateV2_API.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class CompaniesController : ControllerBase
    {
        private readonly ICompanyRepository _companyRepository;

        public CompaniesController(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        //Get All Company
        [HttpGet]
         public async Task<IActionResult> GetCompanies()
         {
            var companies = await _companyRepository.GetCompanies();
            return Ok(companies);
         }

        //Get One Company
        [HttpGet]
        [Route("{id:int}")]
        public async Task<IActionResult> GetOneCompany([FromRoute] int id)
        {
            var company = await _companyRepository.GetCompanyById(id);
            return Ok(company);
        }


        [HttpPut]
        public async Task<IActionResult> UpdateCompany([FromBody] Company company)
        {
            var updatedCompany = await _companyRepository.UpdateCompany(company);
            return Ok(updatedCompany);
        }
    }
}

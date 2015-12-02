package <%- packageName %>.view;

import java.io.Serializable;

import javax.faces.view.ViewScoped;
import javax.inject.Named;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import <%- packageName %>.model.<%-targetName2%>Model;

@ViewScoped
@Named
@SuppressWarnings("serial")
public class <%-targetName2%>CreateView implements Serializable{
	
	@PersistenceContext
	private EntityManager em;
	
	private <%-targetName2%>Model model;
	
	public <%-targetName2%>Model getModel(){
		return model;
	}
	
	public void init(){
		model = new <%-targetName2%>Model();
	}
	
	@Transactional
	public String create(){
		em.persist(model);
		
		return "/views/<%-targetName%>/list.xhtml?faces-redirect=true";
	}
}
